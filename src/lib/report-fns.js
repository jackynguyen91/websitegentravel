import { createServerFn } from "@tanstack/react-start";
import { requireUser } from "@/lib/auth-middleware";
import { paxOf } from "@/lib/departure-seats";
import { costLineTotal } from "@/lib/tour-profit";

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));
const CLOSED = ["Đã hủy", "Hoàn tiền"];
const money = (value) => `${Math.round(Number(value) || 0).toLocaleString("vi-VN")}₫`;

function buildSummary({ bookings, payments, tours, costs, from, to }) {
  const inRange = bookings.filter((booking) => {
    const date = String(booking.booking_date || booking.created_date || "").slice(0, 10);
    return date >= from && date <= to;
  });
  const active = inRange.filter((booking) => !CLOSED.includes(booking.status));
  const revenue = active.reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0);
  const collected = payments
    .filter((row) => row.direction !== "Chi đối tác" && row.status === "Đã thanh toán")
    .filter((row) => {
      const date = String(row.paid_at || row.created_date || "").slice(0, 10);
      return date >= from && date <= to;
    })
    .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const paidOut = payments
    .filter((row) => row.direction === "Chi đối tác" && row.status === "Đã thanh toán")
    .filter((row) => {
      const date = String(row.paid_at || row.created_date || "").slice(0, 10);
      return date >= from && date <= to;
    })
    .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);

  const cost = costs.reduce((sum, row) => {
    const pax = inRange
      .filter((booking) => booking.tour_id === row.tour_id && !CLOSED.includes(booking.status))
      .reduce((acc, booking) => acc + paxOf(booking), 0);
    return sum + costLineTotal(row, pax || 1);
  }, 0);

  const cancelled = inRange.filter((booking) => ["Đã hủy", "Hoàn tiền"].includes(booking.status)).length;
  const tourTitle = new Map(tours.map((tour) => [tour.id, tour.title]));
  const byTour = new Map();
  active.forEach((booking) => {
    const key = booking.tour_id;
    const current = byTour.get(key) || { title: booking.tour_title || tourTitle.get(key) || "Tour", orders: 0, revenue: 0 };
    byTour.set(key, { ...current, orders: current.orders + 1, revenue: current.revenue + (Number(booking.total_price) || 0) });
  });
  const topTours = [...byTour.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const byStaff = new Map();
  inRange.forEach((booking) => {
    const key = booking.sale_owner || "Chưa gán";
    const current = byStaff.get(key) || { name: key, orders: 0, revenue: 0, cancelled: 0 };
    const isClosed = CLOSED.includes(booking.status);
    byStaff.set(key, {
      ...current,
      orders: isClosed ? current.orders : current.orders + 1,
      revenue: isClosed ? current.revenue : current.revenue + (Number(booking.total_price) || 0),
      cancelled: isClosed ? current.cancelled + 1 : current.cancelled,
    });
  });

  return {
    orders: active.length,
    revenue,
    collected,
    paidOut,
    cost,
    profit: revenue - cost,
    margin: revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0,
    cancellationRate: inRange.length > 0 ? (cancelled / inRange.length) * 100 : 0,
    cancelled,
    topTours,
    staff: [...byStaff.values()].sort((a, b) => b.revenue - a.revenue),
  };
}

const row = (label, value) => `<tr><td style="padding:8px 10px;border:1px solid #e2e8f0;color:#475569;">${label}</td><td style="padding:8px 10px;border:1px solid #e2e8f0;text-align:right;font-weight:600;">${value}</td></tr>`;

export const sendWeeklyReport = createServerFn({ method: "POST" }).middleware([requireUser]).handler(async ({ context }) => {
  if (context.user?.role !== "admin") {
    throw Object.assign(new Error("Forbidden"), { status: 403, code: "FORBIDDEN" });
  }
  const base44 = context.getBase44();
  const settingsRows = asArray(await base44.entities.ReportSetting.list({ limit: 1 }));
  const settings = settingsRows[0];
  const recipients = (settings?.recipients || []).filter((email) => String(email).includes("@"));
  if (recipients.length === 0) {
    return { error: "Chưa có email nhận báo cáo. Hãy thêm email lãnh đạo trước khi gửi." };
  }

  const [bookingRows, paymentRows, tourRows, costRows] = await Promise.all([
    base44.entities.Booking.list({ sort: "-booking_date", limit: 500 }),
    base44.entities.Payment.list({ sort: "-created_date", limit: 500 }),
    base44.entities.Tour.list({ limit: 200 }),
    base44.entities.TourCost.list({ limit: 500 }),
  ]);

  const to = new Date();
  const fromDate = new Date(to.getTime() - 6 * 86400000);
  const from = fromDate.toISOString().slice(0, 10);
  const toIso = to.toISOString().slice(0, 10);
  const summary = buildSummary({
    bookings: asArray(bookingRows),
    payments: asArray(paymentRows),
    tours: asArray(tourRows),
    costs: asArray(costRows),
    from,
    to: toIso,
  });

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;max-width:640px;">
      <div style="border-bottom:2px solid #0F766E;padding-bottom:10px;">
        <div style="font-size:20px;font-weight:800;color:#0F766E;">GenTravel</div>
        <div style="font-size:12px;color:#64748b;">Báo cáo tuần ${from.split("-").reverse().join("/")} – ${toIso.split("-").reverse().join("/")}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-top:14px;font-size:13px;">
        ${row("Đơn đặt tour", summary.orders)}
        ${row("Doanh thu", money(summary.revenue))}
        ${row("Đã thu trong tuần", money(summary.collected))}
        ${row("Chi phí tour", money(summary.cost))}
        ${row("Lợi nhuận gộp", `${money(summary.profit)} (${summary.margin.toFixed(1)}%)`)}
        ${row("Tỷ lệ hủy", `${summary.cancellationRate.toFixed(1)}%`)}
      </table>
      <div style="margin-top:16px;font-size:13px;font-weight:700;">Top tour theo doanh thu</div>
      <table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:12.5px;">
        ${summary.topTours
          .map(
            (tour) =>
              `<tr><td style="padding:6px 8px;border:1px solid #e2e8f0;">${tour.title}</td><td style="padding:6px 8px;border:1px solid #e2e8f0;text-align:right;">${tour.orders} đơn</td><td style="padding:6px 8px;border:1px solid #e2e8f0;text-align:right;font-weight:600;">${money(tour.revenue)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin-top:16px;font-size:11.5px;color:#64748b;">Báo cáo tự động gửi cho ban lãnh đạo GenTravel. Truy cập trang Báo cáo & phân tích để xem chi tiết.</p>
    </div>
  `;

  await base44.asServiceRole.integrations.Core.SendEmail({
    to: recipients.join(","),
    subject: `GenTravel · Báo cáo tuần ${from.split("-").reverse().join("/")} – ${toIso.split("-").reverse().join("/")}`,
    html,
  });

  await base44.asServiceRole.entities.ActivityLog.create({
    module: "Báo cáo",
    action: "Gửi báo cáo tuần",
    detail: `Đã gửi tới ${recipients.length} email · doanh thu ${money(summary.revenue)}`,
    actor: context.user.full_name || context.user.email || "",
  });

  return { recipients: recipients.length, revenue: summary.revenue, profit: summary.profit, from, to: toIso };
});