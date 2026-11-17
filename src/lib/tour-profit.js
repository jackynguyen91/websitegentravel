import { paxOf } from "@/lib/departure-seats";

const CLOSED_BOOKING = ["Đã hủy", "Hoàn tiền"];

const quantityOf = (cost) => Math.max(Number(cost.quantity) || 1, 1);

/** Chi phí một dòng: "Mỗi khách" nhân với tổng khách của tour, "Toàn tour" nhân số lượng. */
export const costLineTotal = (cost, tourPax) =>
  Math.round((Number(cost.amount) || 0) * quantityOf(cost) * (cost.basis === "Mỗi khách" ? Math.max(tourPax, 1) : 1));

export function tourFinance(tour, bookings, costs) {
  const tourBookings = bookings.filter((booking) => booking.tour_id === tour.id && !CLOSED_BOOKING.includes(booking.status));
  const pax = tourBookings.reduce((sum, booking) => sum + paxOf(booking), 0);
  const revenue = tourBookings.reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0);
  const cost = costs
    .filter((row) => row.tour_id === tour.id)
    .reduce((sum, row) => sum + costLineTotal(row, pax), 0);
  const profit = revenue - cost;
  return {
    orders: tourBookings.length,
    pax,
    revenue,
    cost,
    profit,
    margin: revenue > 0 ? (profit / revenue) * 100 : 0,
  };
}