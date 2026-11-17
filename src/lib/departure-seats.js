export const DEPARTURE_STATUS_STYLE = {
  "Mở bán": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Sắp đầy": "border-amber-200 bg-amber-50 text-amber-700",
  "Đã đầy": "border-red-200 bg-red-50 text-red-700",
  "Đã khởi hành": "border-sky-200 bg-sky-50 text-sky-700",
  "Đã hủy": "border-slate-200 bg-slate-100 text-slate-500",
};

export const departureStatusStyle = (status) => DEPARTURE_STATUS_STYLE[status] || DEPARTURE_STATUS_STYLE["Mở bán"];

const CLOSED_BOOKING = ["Đã hủy", "Hoàn tiền"];

export const paxOf = (booking) => (Number(booking?.adults_count) || 0) + (Number(booking?.children_count) || 0);

/** Chỗ đã bán tính từ đơn đặt tour thật của đúng tour + ngày khởi hành. */
export function bookedSeatsFor(departure, bookings) {
  const matches = bookings.filter(
    (booking) =>
      booking.tour_id === departure.tour_id &&
      String(booking.departure_date || "").slice(0, 10) === String(departure.departure_date || "").slice(0, 10) &&
      !CLOSED_BOOKING.includes(booking.status),
  );
  if (matches.length > 0) return matches.reduce((sum, booking) => sum + paxOf(booking), 0);
  return Number(departure.seats_booked) || 0;
}

/** Trạng thái suy ra từ số chỗ: tự đóng bán khi hết chỗ. */
export function resolveDepartureStatus(departure, booked) {
  if (["Đã khởi hành", "Đã hủy"].includes(departure.status)) return departure.status;
  const today = new Date().toISOString().slice(0, 10);
  if (String(departure.departure_date || "").slice(0, 10) < today) return "Đã khởi hành";
  const total = Number(departure.seats_total) || 0;
  const held = Number(departure.seats_held) || 0;
  const remaining = total - booked - held;
  if (total > 0 && remaining <= 0) return "Đã đầy";
  if (total > 0 && remaining / total <= 0.2) return "Sắp đầy";
  return "Mở bán";
}

export function departureView(departure, bookings) {
  const booked = bookedSeatsFor(departure, bookings);
  const total = Number(departure.seats_total) || 0;
  const held = Number(departure.seats_held) || 0;
  const remaining = Math.max(total - booked - held, 0);
  const status = resolveDepartureStatus(departure, booked);
  return {
    ...departure,
    booked,
    held,
    remaining,
    total,
    status,
    fill: total > 0 ? Math.min(Math.round(((booked + held) / total) * 100), 100) : 0,
  };
}