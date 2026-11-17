import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { BOOKING_STATUSES, paidOf } from "@/lib/booking-status";

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));
const num = (value) => Number(value) || 0;
const parse = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const bookingTime = (booking) => parse(booking.booking_date)?.getTime() || parse(booking.created_date)?.getTime() || 0;

const SORTERS = {
  newest: (a, b) => bookingTime(b) - bookingTime(a),
  oldest: (a, b) => bookingTime(a) - bookingTime(b),
  "total-desc": (a, b) => num(b.total_price) - num(a.total_price),
  "total-asc": (a, b) => num(a.total_price) - num(b.total_price),
  "departure-asc": (a, b) => (parse(a.departure_date)?.getTime() || 0) - (parse(b.departure_date)?.getTime() || 0),
};

const compact = (booking) => ({
  id: booking.id,
  code: booking.booking_code,
  customer_name: booking.customer_name,
  customer_phone: booking.customer_phone,
  customer_email: booking.customer_email || "",
  tour_id: booking.tour_id,
  tour_title: booking.tour_title,
  departure_date: booking.departure_date,
  booking_date: booking.booking_date || booking.created_date,
  adults: num(booking.adults_count),
  children: num(booking.children_count),
  total: num(booking.total_price),
  paid: paidOf(booking),
  status: booking.status,
  payment_status: booking.payment_status || "Unpaid",
  channel: booking.channel || "Khác",
  sale_owner: booking.sale_owner || "",
});

const inDateRange = (booking, from, to) => {
  const date = parse(booking.booking_date) || parse(booking.created_date);
  if (!date) return true;
  if (from && date < new Date(`${from}T00:00:00`)) return false;
  if (to && date > new Date(`${to}T23:59:59`)) return false;
  return true;
};

export const listAdminBookings = createServerFn({ method: "GET" })
  .validator(
    z.object({
      q: z.string().max(80).optional(),
      status: z.string().max(40).optional(),
      payment: z.string().max(30).optional(),
      tour_id: z.string().max(64).optional(),
      channel: z.string().max(30).optional(),
      sale: z.string().max(60).optional(),
      from: z.string().max(30).optional(),
      to: z.string().max(30).optional(),
      sort: z.string().max(20).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const [bookingRows, tourRows] = await Promise.all([
      base44.entities.Booking.list({ sort: "-booking_date", limit: 1000 }),
      base44.entities.Tour.list({ limit: 300 }),
    ]);
    const bookings = asArray(bookingRows);
    const tours = asArray(tourRows);

    const text = (data.q || "").trim().toLowerCase();
    const base = bookings.filter((booking) => {
      if (data.tour_id && booking.tour_id !== data.tour_id) return false;
      if (data.channel && data.channel !== "all" && booking.channel !== data.channel) return false;
      if (data.sale && data.sale !== "all" && (booking.sale_owner || "") !== data.sale) return false;
      if (data.payment && booking.payment_status !== data.payment) return false;
      if (!inDateRange(booking, data.from, data.to)) return false;
      if (!text) return true;
      return [booking.booking_code, booking.customer_name, booking.customer_phone, booking.customer_email, booking.tour_title]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(text));
    });

    const statusCounts = {};
    BOOKING_STATUSES.forEach((status) => {
      statusCounts[status] = 0;
    });
    base.forEach((booking) => {
      statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
    });

    const rows = (data.status ? base.filter((booking) => booking.status === data.status) : base)
      .slice()
      .sort(SORTERS[data.sort] || SORTERS.newest);

    return {
      items: rows.slice(0, 300).map(compact),
      total: rows.length,
      statusCounts,
      totals: {
        value: rows.reduce((sum, booking) => sum + num(booking.total_price), 0),
        collected: rows.reduce((sum, booking) => sum + paidOf(booking), 0),
      },
      facets: {
        tours: tours
          .map((tour) => ({ id: tour.id, title: tour.title }))
          .sort((a, b) => String(a.title).localeCompare(String(b.title), "vi")),
        sales: [...new Set(bookings.map((booking) => booking.sale_owner).filter(Boolean))].sort(),
      },
    };
  });

export const getBookingDetail = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1).max(64) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const booking = await base44.entities.Booking.get(data.id).catch((error) => {
      if (error?.status === 404) return null;
      throw error;
    });
    if (!booking) return null;

    const [paymentRows, tour, customer] = await Promise.all([
      base44.entities.Payment.filter({ booking_code: booking.booking_code }, { sort: "-created_date", limit: 50 }),
      booking.tour_id ? base44.entities.Tour.get(booking.tour_id).catch(() => null) : null,
      booking.customer_id ? base44.entities.Customer.get(booking.customer_id).catch(() => null) : null,
    ]);

    return {
      booking,
      payments: asArray(paymentRows).map((payment) => ({
        id: payment.id,
        amount: num(payment.amount),
        method: payment.method || "Chuyển khoản",
        status: payment.status || "Đã thanh toán",
        paid_at: payment.paid_at || payment.created_date,
        note: payment.note || "",
      })),
      tour: tour ? { id: tour.id, title: tour.title, duration_days: tour.duration_days, duration_nights: tour.duration_nights } : null,
      customer: customer ? { id: customer.id, full_name: customer.full_name, tier: customer.tier || "Mới", tags: customer.tags || [] } : null,
    };
  });

const appendActivity = (booking, text, type = "status") => [
  ...(booking.activities || []),
  { at: new Date().toISOString(), type, text },
];

export const updateBookingStatus = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1).max(64), status: z.enum(BOOKING_STATUSES) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const booking = await base44.entities.Booking.get(data.id);
    if (!booking) return { error: "Không tìm thấy đơn đặt tour." };

    const patch = { status: data.status };
    if (data.status === "Đã thanh toán") {
      patch.payment_status = "Paid";
      patch.paid_amount = num(booking.total_price);
    } else if (data.status === "Đã thanh toán một phần" && booking.payment_status === "Unpaid") {
      patch.payment_status = "Partial";
    }
    patch.activities = appendActivity(booking, `Chuyển trạng thái: ${booking.status} → ${data.status}`);

    await base44.entities.Booking.update(booking.id, patch);
    return { ok: true, status: data.status };
  });

export const bulkBookingStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      ids: z.array(z.string().min(1).max(64)).min(1).max(100),
      status: z.enum(BOOKING_STATUSES),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    let updated = 0;
    for (const id of data.ids) {
      const booking = await base44.entities.Booking.get(id).catch(() => null);
      if (!booking) continue;
      const patch = { status: data.status };
      if (data.status === "Đã thanh toán") {
        patch.payment_status = "Paid";
        patch.paid_amount = num(booking.total_price);
      } else if (data.status === "Đã thanh toán một phần" && booking.payment_status === "Unpaid") {
        patch.payment_status = "Partial";
      }
      patch.activities = appendActivity(booking, `Cập nhật hàng loạt: ${booking.status} → ${data.status}`);
      await base44.entities.Booking.update(id, patch);
      updated += 1;
    }
    return { updated };
  });

export const addBookingNote = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1).max(64), text: z.string().trim().min(1).max(800) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const booking = await base44.entities.Booking.get(data.id);
    if (!booking) return { error: "Không tìm thấy đơn đặt tour." };
    const notes = [...(booking.internal_notes || []), { at: new Date().toISOString(), author: "Quản trị viên", text: data.text }];
    await base44.entities.Booking.update(booking.id, {
      internal_notes: notes,
      activities: appendActivity(booking, "Thêm ghi chú nội bộ", "note"),
    });
    return { ok: true, notes };
  });

export const addBookingPayment = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1).max(64),
      amount: z.number().int().positive().max(5_000_000_000),
      method: z.string().max(30).optional(),
      note: z.string().trim().max(300).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const booking = await base44.entities.Booking.get(data.id);
    if (!booking) return { error: "Không tìm thấy đơn đặt tour." };

    await base44.entities.Payment.create({
      booking_code: booking.booking_code,
      booking_id: booking.id,
      customer_name: booking.customer_name,
      amount: data.amount,
      method: data.method || "Chuyển khoản",
      status: "Đã thanh toán",
      paid_at: new Date().toISOString(),
      note: data.note || "",
    });

    const paid = paidOf(booking) + data.amount;
    const total = num(booking.total_price);
    const fullyPaid = paid >= total;
    const activities = appendActivity(
      booking,
      `Ghi nhận thanh toán ${data.amount.toLocaleString("vi-VN")}₫ · ${data.method || "Chuyển khoản"}`,
      "payment",
    );
    const nextStatus = fullyPaid
      ? "Đã thanh toán"
      : ["Đã hủy", "Hoàn tiền"].includes(booking.status)
        ? booking.status
        : "Đã thanh toán một phần";

    await base44.entities.Booking.update(booking.id, {
      paid_amount: paid,
      payment_status: fullyPaid ? "Paid" : "Partial",
      status: nextStatus,
      activities,
    });

    return { ok: true, paid_amount: paid, payment_status: fullyPaid ? "Paid" : "Partial" };
  });

const emailBody = (booking) =>
  [
    `Xin chào ${booking.customer_name},`,
    "",
    `GenTravel xác nhận đơn đặt tour "${booking.tour_title}" của quý khách.`,
    `Mã đơn: ${booking.booking_code}`,
    `Ngày khởi hành: ${booking.departure_date || "đang cập nhật"}`,
    `Số khách: ${num(booking.adults_count)} người lớn, ${num(booking.children_count)} trẻ em`,
    `Tổng giá trị: ${num(booking.total_price).toLocaleString("vi-VN")}₫`,
    "",
    "Chuyên viên GenTravel sẽ liên hệ trước ngày khởi hành để dặn dò hành trình. Hotline 1900 6789.",
  ].join("\n");

export const sendBookingEmails = createServerFn({ method: "POST" })
  .validator(z.object({ ids: z.array(z.string().min(1).max(64)).min(1).max(20) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const service = context.getBase44().asServiceRole;
    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const id of data.ids) {
      const booking = await base44.entities.Booking.get(id).catch(() => null);
      if (!booking?.customer_email) {
        skipped += 1;
        continue;
      }
      try {
        await service.integrations.Core.SendEmail({
          to: booking.customer_email,
          subject: `GenTravel xác nhận đơn đặt tour ${booking.booking_code}`,
          body: emailBody(booking),
        });
        sent += 1;
        await base44.entities.Booking.update(booking.id, {
          activities: appendActivity(booking, `Đã gửi email xác nhận tới ${booking.customer_email}`, "email"),
        });
      } catch (error) {
        failed += 1;
      }
    }

    return { sent, skipped, failed };
  });