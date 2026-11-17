import { paxOf } from "@/lib/departure-seats";
import { costLineTotal } from "@/lib/tour-profit";

const CLOSED = ["Đã hủy", "Hoàn tiền"];

export const REPORT_RANGES = [
  { key: "7d", label: "7 ngày" },
  { key: "30d", label: "30 ngày" },
  { key: "90d", label: "90 ngày" },
  { key: "month", label: "Tháng này" },
  { key: "quarter", label: "Quý này" },
];

export function rangeBounds(key) {
  const now = new Date();
  let from;
  if (key === "month") from = new Date(now.getFullYear(), now.getMonth(), 1);
  else if (key === "quarter") from = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  else from = new Date(now.getTime() - (Number(key.replace("d", "")) - 1) * 86400000);
  return { from: from.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
}

const dateOf = (value) => String(value || "").slice(0, 10);

export function computeReport({ bookings, tours, costs, payments, range }) {
  const { from, to } = rangeBounds(range);
  const inRange = bookings.filter((booking) => {
    const date = dateOf(booking.booking_date || booking.created_date);
    return date >= from && date <= to;
  });
  const active = inRange.filter((booking) => !CLOSED.includes(booking.status));
  const cancelled = inRange.filter((booking) => CLOSED.includes(booking.status));

  const revenue = active.reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0);
  const collected = payments
    .filter((row) => row.direction !== "Chi đối tác" && row.status === "Đã thanh toán" && dateOf(row.paid_at || row.created_date) >= from && dateOf(row.paid_at || row.created_date) <= to)
    .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);

  const paxByTour = new Map();
  active.forEach((booking) => {
    paxByTour.set(booking.tour_id, (paxByTour.get(booking.tour_id) || 0) + paxOf(booking));
  });
  const costByTour = new Map();
  costs.forEach((cost) => {
    const pax = paxByTour.get(cost.tour_id) || 0;
    if (pax === 0) return;
    costByTour.set(cost.tour_id, (costByTour.get(cost.tour_id) || 0) + costLineTotal(cost, pax));
  });
  const cost = [...costByTour.values()].reduce((sum, value) => sum + value, 0);

  const byTourMap = new Map();
  active.forEach((booking) => {
    const current = byTourMap.get(booking.tour_id) || {
      id: booking.tour_id,
      name: booking.tour_title || "Tour",
      orders: 0,
      revenue: 0,
    };
    byTourMap.set(booking.tour_id, {
      ...current,
      orders: current.orders + 1,
      revenue: current.revenue + (Number(booking.total_price) || 0),
    });
  });
  const byTour = [...byTourMap.values()]
    .map((row) => {
      const tourCost = costByTour.get(row.id) || 0;
      return { ...row, cost: tourCost, profit: row.revenue - tourCost, margin: row.revenue > 0 ? ((row.revenue - tourCost) / row.revenue) * 100 : 0 };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const byChannelMap = new Map();
  active.forEach((booking) => {
    const key = booking.channel || "Website";
    const current = byChannelMap.get(key) || { name: key, orders: 0, revenue: 0 };
    byChannelMap.set(key, { ...current, orders: current.orders + 1, revenue: current.revenue + (Number(booking.total_price) || 0) });
  });
  const byChannel = [...byChannelMap.values()].sort((a, b) => b.revenue - a.revenue);

  const byStaffMap = new Map();
  inRange.forEach((booking) => {
    const key = booking.sale_owner || "Chưa gán";
    const isClosed = CLOSED.includes(booking.status);
    const current = byStaffMap.get(key) || { name: key, orders: 0, revenue: 0, cancelled: 0 };
    byStaffMap.set(key, {
      ...current,
      orders: isClosed ? current.orders : current.orders + 1,
      revenue: isClosed ? current.revenue : current.revenue + (Number(booking.total_price) || 0),
      cancelled: isClosed ? current.cancelled + 1 : current.cancelled,
    });
  });
  const byStaff = [...byStaffMap.values()]
    .map((row) => {
      const total = row.orders + row.cancelled;
      return {
        ...row,
        cancelRate: total > 0 ? (row.cancelled / total) * 100 : 0,
        avgOrder: row.orders > 0 ? row.revenue / row.orders : 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  return {
    from,
    to,
    orders: active.length,
    revenue,
    collected,
    cost,
    profit: revenue - cost,
    margin: revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0,
    cancellationRate: inRange.length > 0 ? (cancelled.length / inRange.length) * 100 : 0,
    cancelledCount: cancelled.length,
    avgOrder: active.length > 0 ? revenue / active.length : 0,
    byTour,
    byChannel,
    byStaff,
  };
}