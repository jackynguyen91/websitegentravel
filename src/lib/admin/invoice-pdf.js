import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { formatDateVN, formatVND } from "@/lib/format";
import { PAYMENT_LABEL, paidOf } from "@/lib/booking-status";

const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function passengerRows(booking) {
  const list = booking.passengers?.length
    ? booking.passengers
    : [
        { full_name: booking.customer_name || "Khách", type: "Người đại diện" },
        ...Array.from({ length: Math.max((Number(booking.children_count) || 0), 0) }, () => ({ full_name: "Trẻ em", type: "Trẻ em" })),
      ];
  return list
    .map(
      (item, index) =>
        `<tr><td style="padding:6px 8px;border:1px solid #e2e8f0;">${index + 1}</td><td style="padding:6px 8px;border:1px solid #e2e8f0;">${esc(item.full_name)}</td><td style="padding:6px 8px;border:1px solid #e2e8f0;">${esc(item.type || "Người lớn")}</td></tr>`,
    )
    .join("");
}

export async function downloadInvoicePdf(booking, payments = []) {
  const paid = paidOf(booking);
  const total = Number(booking.total_price) || 0;
  const node = document.createElement("div");
  node.style.cssText =
    "position:fixed;left:-10000px;top:0;width:794px;padding:48px;background:#ffffff;color:#0f172a;font-family:Arial,Helvetica,sans-serif;font-size:12px;";
  node.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0F766E;padding-bottom:14px;">
      <div>
        <div style="font-size:22px;font-weight:800;color:#0F766E;letter-spacing:-0.4px;">GenTravel</div>
        <div style="font-size:11px;color:#64748b;margin-top:2px;">Mạng lưới bán tour trong nước &amp; quốc tế</div>
        <div style="font-size:11px;color:#64748b;">Hotline 1900 6789 · booking@gentravel.vn</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:15px;font-weight:700;">PHIẾU XÁC NHẬN &amp; HÓA ĐƠN</div>
        <div style="font-size:12px;margin-top:4px;">Mã đơn: <b>${esc(booking.booking_code)}</b></div>
        <div style="font-size:11px;color:#64748b;">Ngày tạo: ${esc(formatDateVN(booking.booking_date || booking.created_date))}</div>
        <div style="font-size:11px;color:#64748b;">Trạng thái: ${esc(booking.status)}</div>
      </div>
    </div>
    <table style="width:100%;margin-top:18px;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:top;width:55%;padding-right:12px;">
          <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin-bottom:4px;">Khách hàng</div>
          <div style="font-size:13px;font-weight:700;">${esc(booking.customer_name)}</div>
          <div style="color:#475569;">${esc(booking.customer_phone)}</div>
          <div style="color:#475569;">${esc(booking.customer_email || "—")}</div>
        </td>
        <td style="vertical-align:top;width:45%;">
          <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin-bottom:4px;">Tour</div>
          <div style="font-size:13px;font-weight:700;">${esc(booking.tour_title)}</div>
          <div style="color:#475569;">Khởi hành: ${esc(formatDateVN(booking.departure_date))}</div>
          <div style="color:#475569;">${Number(booking.adults_count) || 0} người lớn · ${Number(booking.children_count) || 0} trẻ em</div>
        </td>
      </tr>
    </table>
    <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin:18px 0 6px;">Danh sách hành khách</div>
    <table style="width:100%;border-collapse:collapse;font-size:11.5px;">
      <thead><tr style="background:#f1f5f9;"><th style="padding:6px 8px;border:1px solid #e2e8f0;text-align:left;width:40px;">#</th><th style="padding:6px 8px;border:1px solid #e2e8f0;text-align:left;">Họ tên</th><th style="padding:6px 8px;border:1px solid #e2e8f0;text-align:left;">Loại</th></tr></thead>
      <tbody>${passengerRows(booking)}</tbody>
    </table>
    <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin:18px 0 6px;">Thanh toán</div>
    <table style="width:100%;border-collapse:collapse;font-size:11.5px;">
      <thead><tr style="background:#f1f5f9;"><th style="padding:6px 8px;border:1px solid #e2e8f0;text-align:left;">Phương thức</th><th style="padding:6px 8px;border:1px solid #e2e8f0;text-align:left;">Thời điểm</th><th style="padding:6px 8px;border:1px solid #e2e8f0;text-align:right;">Số tiền</th></tr></thead>
      <tbody>
        ${
          payments.length
            ? payments
                .map(
                  (item) =>
                    `<tr><td style="padding:6px 8px;border:1px solid #e2e8f0;">${esc(item.method || "Chuyển khoản")}</td><td style="padding:6px 8px;border:1px solid #e2e8f0;">${esc(formatDateVN(item.paid_at || item.created_date, true))}</td><td style="padding:6px 8px;border:1px solid #e2e8f0;text-align:right;">${esc(formatVND(item.amount))}</td></tr>`,
                )
                .join("")
            : `<tr><td colspan="3" style="padding:6px 8px;border:1px solid #e2e8f0;color:#64748b;">${esc(PAYMENT_LABEL[booking.payment_status] || "Chưa thanh toán")}</td></tr>`
        }
      </tbody>
    </table>
    <table style="width:100%;margin-top:14px;font-size:12px;">
      <tr><td style="text-align:right;padding:3px 0;color:#475569;">Tổng giá trị đơn:</td><td style="text-align:right;width:140px;font-weight:600;">${esc(formatVND(total))}</td></tr>
      <tr><td style="text-align:right;padding:3px 0;color:#475569;">Đã thanh toán:</td><td style="text-align:right;font-weight:600;">${esc(formatVND(paid))}</td></tr>
      <tr><td style="text-align:right;padding:3px 0;color:#0F766E;font-weight:700;">Còn lại:</td><td style="text-align:right;font-weight:700;color:#0F766E;">${esc(formatVND(Math.max(total - paid, 0)))}</td></tr>
    </table>
    <div style="margin-top:22px;font-size:10.5px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:10px;">
      Phiếu xác nhận được phát hành tự động bởi hệ thống GenTravel. Vui lòng giữ phiếu này khi lên đoàn. Mọi thay đổi về lịch khởi hành sẽ được thông báo qua điện thoại và email.
    </div>
  `;
  document.body.appendChild(node);
  try {
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" });
    const image = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = pageWidth / canvas.width;
    const height = canvas.height * ratio;
    if (height <= pageHeight) {
      pdf.addImage(image, "JPEG", 0, 0, pageWidth, height);
    } else {
      let remaining = height;
      let offset = 0;
      while (remaining > 0) {
        pdf.addImage(image, "JPEG", 0, -offset, pageWidth, height);
        remaining -= pageHeight;
        offset += pageHeight;
        if (remaining > 0) pdf.addPage();
      }
    }
    pdf.save(`Phieu-xac-nhan-${booking.booking_code}.pdf`);
  } finally {
    node.remove();
  }
}