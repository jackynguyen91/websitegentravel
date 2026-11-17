import { paidOf } from "@/lib/booking-status";
import { costLineTotal } from "@/lib/tour-profit";
import { paxOf } from "@/lib/departure-seats";

const CLOSED = ["Đã hủy", "Hoàn tiền"];

export const METHOD_STYLE = {
  "Chuyển khoản": "border-sky-200 bg-sky-50 text-sky-700",
  "VNPay": "border-indigo-200 bg-indigo-50 text-indigo-700",
  "MoMo": "border-pink-200 bg-pink-50 text-pink-700",
  "Tiền mặt": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "VietQR": "border-blue-200 bg-blue-50 text-blue-700",
  "Thẻ tín dụng": "border-purple-200 bg-purple-50 text-purple-700",
  "Đại lý thu": "border-amber-200 bg-amber-50 text-amber-700",
};

export const PAYMENT_STATUS_STYLE = {
  "Đã thanh toán": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Chờ xử lý": "border-amber-200 bg-amber-50 text-amber-700",
  "Thất bại": "border-red-200 bg-red-50 text-red-700",
  "Đã hoàn tiền": "border-slate-200 bg-slate-100 text-slate-600",
};

export const RECEIVED = "Đã thanh toán";

/** Tổng tiền đã thực thu của một đơn (ưu tiên sổ giao dịch, sau đó tới paid_amount của đơn). */
export function receivedForBooking(booking, payments) {
  const rows = payments.filter(
    (row) => row.direction !== "Chi đối tác" && row.booking_code === booking.booking_code && row.status === RECEIVED,
  );
  const fromLedger = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  if (rows.length > 0) return fromLedger;
  return paidOf(booking);
}

export function receivablesOf(bookings, payments) {
  return bookings
    .filter((booking) => !CLOSED.includes(booking.status))
    .map((booking) => {
      const total = Number(booking.total_price) || 0;
      const paid = receivedForBooking(booking, payments);
      return { booking, total, paid, remaining: Math.max(total - paid, 0) };
    })
    .filter((row) => row.remaining > 0)
    .sort((a, b) => b.remaining - a.remaining);
}

/** Công nợ phải trả đối tác = chi phí tour đã ghi nhận − đã chi. */
export function payablesOf({ partners, tours, costs, bookings, payments }) {
  const tourById = new Map(tours.map((tour) => [tour.id, tour]));
  const costByPartner = new Map();

  costs.forEach((cost) => {
    if (!cost.partner_id) return;
    const tour = tourById.get(cost.tour_id);
    const pax = bookings
      .filter((booking) => booking.tour_id === cost.tour_id && !CLOSED.includes(booking.status))
      .reduce((sum, booking) => sum + paxOf(booking), 0);
    costByPartner.set(cost.partner_id, (costByPartner.get(cost.partner_id) || 0) + costLineTotal(cost, pax || 1));
  });

  return partners
    .map((partner) => {
      const cost = costByPartner.get(partner.id) || 0;
      const paid = payments
        .filter((row) => row.direction === "Chi đối tác" && row.partner_id === partner.id && row.status === RECEIVED)
        .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
      const pending = payments
        .filter((row) => row.direction === "Chi đối tác" && row.partner_id === partner.id && row.status === "Chờ xử lý")
        .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
      return { partner, cost, paid, pending, remaining: Math.max(cost - paid - pending, 0) };
    })
    .filter((row) => row.cost > 0)
    .sort((a, b) => b.remaining - a.remaining);
}