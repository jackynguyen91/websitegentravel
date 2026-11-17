import { createFileRoute } from "@tanstack/react-router";

// Webhook nhận thông báo chuyển khoản từ dịch vụ ngân hàng (Casso, SePay, payOS…).
// Đơn được khớp theo mã đặt chỗ nằm trong nội dung chuyển khoản (ví dụ "BK-1234 ...").
const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));
const num = (value) => Number(value) || 0;
const CLOSED = ["Đã hủy", "Hoàn tiền"];

const tokensFromRequest = (request) => {
  const headers = [
    request.headers.get("x-webhook-token"),
    request.headers.get("secure-token"),
    request.headers.get("x-api-key"),
    request.headers.get("authorization"),
  ].filter(Boolean);
  return [
    ...headers.map((value) => value.replace(/^(bearer|apikey|api[_-]?key|token)\s+/i, "").trim()),
    ...headers.map((value) => value.trim()),
    (new URL(request.url).searchParams.get("token") || "").trim(),
  ].filter(Boolean);
};

const safeEqual = (a, b) => {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

const bookingCodeFrom = (text) => {
  const match = String(text || "").match(/BK[\s._-]?(\d{3,8})/i);
  return match ? `BK-${match[1]}` : "";
};

// Chuẩn hoá payload của các dịch vụ khác nhau về cùng một dạng.
const transactionsOf = (payload) => {
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.transactions)
        ? payload.transactions
        : Array.isArray(payload?.data?.transactions)
          ? payload.data.transactions
          : payload
            ? [payload]
            : [];

  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const type = String(item.transferType ?? item.type ?? "").toLowerCase();
      const rawAmount = item.transferAmount ?? item.amount ?? item.creditAmount ?? item.linearAmount ?? 0;
      const description = [item.content, item.description, item.transferContent, item.memo, item.code]
        .filter(Boolean)
        .join(" ");
      return {
        ref: String(item.id ?? item.referenceCode ?? item.transactionId ?? item.reference ?? item.tid ?? "").trim(),
        amount: Math.abs(num(rawAmount)),
        description: description.trim(),
        incoming: type ? type === "in" || type === "credit" : num(rawAmount) >= 0,
        when: item.transactionDate ?? item.when ?? item.createdAt ?? new Date().toISOString(),
      };
    });
};

async function handleWebhook(request, context) {
  const base44 = context.getBase44().asServiceRole;
  const settingsRows = asArray(await base44.entities.BankSetting.list({ limit: 1 }));
  const setting = settingsRows[0];
  if (!setting?.webhook_token) {
    return Response.json({ error: "Webhook chưa được cấu hình trong ứng dụng." }, { status: 503 });
  }
  if (!tokensFromRequest(request).some((token) => safeEqual(token, setting.webhook_token))) {
    return Response.json({ error: "Sai mã xác thực webhook." }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Nội dung giao dịch không hợp lệ." }, { status: 400 });
  }

  const autoConfirm = setting.auto_confirm !== false;
  const results = [];

  for (const tx of transactionsOf(payload).slice(0, 20)) {
    if (!tx.incoming || tx.amount <= 0) {
      results.push({ skipped: "not_incoming" });
      continue;
    }
    const code = bookingCodeFrom(tx.description);
    if (!code) {
      results.push({ skipped: "no_booking_code" });
      continue;
    }

    let rows = asArray(await base44.entities.Booking.filter({ booking_code: code }, { limit: 1 }));
    if (rows.length === 0) {
      const digits = code.split("-")[1];
      rows = asArray(await base44.entities.Booking.filter({ booking_code: { $regex: digits } }, { limit: 1 }));
    }
    const booking = rows[0];
    if (!booking) {
      results.push({ skipped: "booking_not_found", code });
      continue;
    }

    const ref = tx.ref || `${booking.booking_code}-${tx.amount}-${tx.when}`;
    const duplicate = await base44.entities.Payment.count({ external_ref: ref });
    if (duplicate) {
      results.push({ skipped: "duplicate", code: booking.booking_code });
      continue;
    }

    const total = num(booking.total_price);
    const paidBefore = num(booking.paid_amount);
    const paid = paidBefore + tx.amount;
    const fullyPaid = total <= 0 || paid >= total - 1;
    const kind = fullyPaid ? "Thanh toán toàn bộ" : paidBefore > 0 ? "Thanh toán còn lại" : "Đặt cọc";
    const at = new Date().toISOString();

    await base44.entities.Payment.create({
      direction: "Thu từ khách",
      booking_code: booking.booking_code,
      booking_id: booking.id,
      tour_id: booking.tour_id || "",
      customer_name: booking.customer_name || "",
      amount: tx.amount,
      kind,
      method: "VietQR",
      status: autoConfirm ? "Đã thanh toán" : "Chờ xử lý",
      paid_at: at,
      external_ref: ref,
      reconciled: false,
      note: `Tự động từ chuyển khoản: ${tx.description || "không có nội dung"}`.slice(0, 280),
    });

    const activity = {
      at,
      type: "payment",
      text: autoConfirm
        ? `Nhận ${tx.amount.toLocaleString("vi-VN")}₫ qua VietQR — hệ thống tự xác nhận`
        : `Nhận ${tx.amount.toLocaleString("vi-VN")}₫ qua VietQR — chờ kế toán xác nhận`,
    };
    const activities = [...(booking.activities || []), activity];
    const patch = { activities };

    if (autoConfirm) {
      patch.paid_amount = paid;
      patch.payment_status = fullyPaid ? "Paid" : "Partial";
      if (!CLOSED.includes(booking.status) && booking.status !== "Hoàn tất") {
        patch.status = fullyPaid ? "Đã thanh toán" : "Đã thanh toán một phần";
      }
    } else {
      patch.payment_status = "Pending Verification";
    }

    await base44.entities.Booking.update(booking.id, patch);

    await base44.entities.ActivityLog.create({
      module: "Thanh toán",
      action: autoConfirm ? "Tự động xác nhận thanh toán" : "Nhận chuyển khoản chờ xác nhận",
      detail: `${tx.amount.toLocaleString("vi-VN")}₫ · ${booking.booking_code} · VietQR`,
      entity_id: booking.id,
      actor: "Webhook VietQR",
    });

    results.push({ code: booking.booking_code, amount: tx.amount, payment_status: patch.payment_status });
  }

  return Response.json({ success: true, processed: results.length, results });
}

export const Route = createFileRoute("/api/vietqr-webhook")({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        const base44 = context.getBase44().asServiceRole;
        const setting = asArray(await base44.entities.BankSetting.list({ limit: 1 }))[0];
        if (!tokensFromRequest(request).some((token) => safeEqual(token, setting?.webhook_token || ""))) {
          return Response.json({ error: "Sai mã xác thực webhook." }, { status: 401 });
        }
        return Response.json({ ok: true, auto_confirm: setting?.auto_confirm !== false });
      },
      POST: ({ request, context }) => handleWebhook(request, context),
    },
  },
});