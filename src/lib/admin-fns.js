import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));
const num = (value) => Number(value) || 0;
const parse = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const startOfDay = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};
const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};
const bookingDate = (booking) => parse(booking.booking_date) || parse(booking.created_date);
const isPaid = (booking) => booking.payment_status === "Paid";
const pax = (booking) => num(booking.adults_count) + num(booking.children_count);

function resolveRange({ range = "30d", from, to }) {
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  if (range === "custom" && from && to) {
    return { start: startOfDay(parse(from) || now), end: addDays(startOfDay(parse(to) || now), 1), preset: "custom" };
  }
  if (range === "today") return { start: startOfDay(now), end: endOfToday, preset: "today" };
  if (range === "7d") return { start: startOfDay(addDays(now, -6)), end: endOfToday, preset: "7d" };
  if (range === "month") return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: endOfToday, preset: "month" };
  if (range === "quarter") {
    const quarterStart = Math.floor(now.getMonth() / 3) * 3;
    return { start: new Date(now.getFullYear(), quarterStart, 1), end: endOfToday, preset: "quarter" };
  }
  if (range === "year") return { start: new Date(now.getFullYear(), 0, 1), end: endOfToday, preset: "year" };
  return { start: startOfDay(addDays(now, -29)), end: endOfToday, preset: "30d" };
}

function previousRange(start, end, mode) {
  if (mode === "yoy") {
    const s = new Date(start);
    s.setFullYear(s.getFullYear() - 1);
    const e = new Date(end);
    e.setFullYear(e.getFullYear() - 1);
    return { start: s, end: e };
  }
  const span = end.getTime() - start.getTime();
  return { start: new Date(start.getTime() - span), end: new Date(start.getTime()) };
}

function summarize(bookings, toursById, departures, start, end) {
  const rows = bookings.filter((booking) => {
    const date = bookingDate(booking);
    return date && date >= start && date <= end;
  });
  const tours = toursById;
  const paid = rows.filter(isPaid);
  const revenue = paid.reduce((sum, item) => sum + num(item.total_price), 0);
  const expected = rows
    .filter((item) => item.status === "Đã xác nhận" && !isPaid(item))
    .reduce((sum, item) => sum + num(item.total_price), 0);
  const cancelled = rows.filter((item) => item.status === "Đã hủy").length;
  const guests = rows.filter((item) => item.status !== "Đã hủy").reduce((sum, item) => sum + pax(item), 0);
  const receivable = rows
    .filter((item) => item.status !== "Đã hủy" && !isPaid(item))
    .reduce((sum, item) => sum + num(item.total_price), 0);
  const cost = paid.reduce((sum, item) => {
    const tour = tours.get(item.tour_id);
    if (!tour) return sum;
    return sum + num(tour.cost_adult) * num(item.adults_count) + num(tour.cost_child) * num(item.children_count);
  }, 0);
  const seats = departures.filter((dep) => {
    const date = parse(dep.departure_date);
    return date && date >= start && date <= end && dep.status !== "Đã hủy";
  });
  const seatsTotal = seats.reduce((sum, dep) => sum + num(dep.seats_total), 0);
  const seatsBooked = seats.reduce((sum, dep) => sum + num(dep.seats_booked), 0);

  return {
    revenue,
    expected,
    orders: rows.length,
    aov: rows.length ? Math.round(revenue / Math.max(paid.length, 1)) : 0,
    guests,
    cancelled,
    cancelRate: rows.length ? (cancelled / rows.length) * 100 : 0,
    fillRate: seatsTotal ? (seatsBooked / seatsTotal) * 100 : 0,
    receivable,
    cost,
    profit: revenue - cost,
  };
}

const UNITS = { day: 1, week: 7 };
function makeBuckets(start, end, unit) {
  const buckets = [];
  if (unit === "month") {
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cursor < end) {
      const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      buckets.push({ start: new Date(cursor), end: next, label: `T${cursor.getMonth() + 1}/${String(cursor.getFullYear()).slice(2)}` });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return buckets;
  }
  if (unit === "quarter") {
    const cursor = new Date(start.getFullYear(), Math.floor(start.getMonth() / 3) * 3, 1);
    while (cursor < end) {
      const next = new Date(cursor.getFullYear(), cursor.getMonth() + 3, 1);
      buckets.push({ start: new Date(cursor), end: next, label: `Q${Math.floor(cursor.getMonth() / 3) + 1}/${String(cursor.getFullYear()).slice(2)}` });
      cursor.setMonth(cursor.getMonth() + 3);
    }
    return buckets;
  }
  const step = UNITS[unit] || 7;
  const cursor = startOfDay(start);
  while (cursor < end) {
    const next = addDays(cursor, step);
    buckets.push({
      start: new Date(cursor),
      end: next,
      label: cursor.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
    });
    cursor.setDate(cursor.getDate() + step);
  }
  return buckets;
}

function seriesFor(bookings, start, end, unit, prevShiftStart) {
  const buckets = makeBuckets(start, end, unit);
  if (buckets.length > 40) return [];
  return buckets.map((bucket) => {
    const inBucket = bookings.filter((booking) => {
      const date = bookingDate(booking);
      return date && date >= bucket.start && date < bucket.end;
    });
    const revenue = inBucket.filter(isPaid).reduce((sum, item) => sum + num(item.total_price), 0);
    const prevStart = new Date(bucket.start.getTime() + prevShiftStart);
    const prevEnd = new Date(bucket.end.getTime() + prevShiftStart);
    const prevRevenue = bookings
      .filter((booking) => {
        const date = bookingDate(booking);
        return isPaid(booking) && date && date >= prevStart && date < prevEnd;
      })
      .reduce((sum, item) => sum + num(item.total_price), 0);
    return { label: bucket.label, revenue, orders: inBucket.length, prevRevenue };
  });
}

const GROUP_LABEL = { domestic: "Tour nội địa", international: "Tour quốc tế" };

export const getDashboard = createServerFn({ method: "GET" })
  .validator(
    z.object({
      range: z.string().max(20).optional(),
      from: z.string().max(30).optional(),
      to: z.string().max(30).optional(),
      scope: z.string().max(30).optional(),
      destination: z.string().max(80).optional(),
      channel: z.string().max(30).optional(),
      sale: z.string().max(60).optional(),
      compare: z.string().max(10).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const [bookingRows, tourRows, departureRows] = await Promise.all([
      base44.entities.Booking.list({ sort: "-booking_date", limit: 1000 }),
      base44.entities.Tour.list({ limit: 300 }),
      base44.entities.Departure.list({ sort: "departure_date", limit: 500 }),
    ]);
    const bookings = asArray(bookingRows);
    const tours = asArray(tourRows);
    const departures = asArray(departureRows);
    const toursById = new Map(tours.map((tour) => [tour.id, tour]));

    const { start, end } = resolveRange(data);
    const prev = previousRange(start, end, data.compare || "prev");
    const shift = data.compare === "yoy" ? -365 * 24 * 3600 * 1000 : -(end.getTime() - start.getTime());

    const matches = (booking) => {
      if (data.channel && booking.channel !== data.channel) return false;
      if (data.sale && booking.sale_owner !== data.sale) return false;
      const tour = toursById.get(booking.tour_id);
      if (data.scope && data.scope !== "all") {
        if ((tour?.scope || "domestic") !== data.scope) return false;
      }
      if (data.destination && data.destination !== "all" && tour?.destination !== data.destination) return false;
      return true;
    };
    const scoped = bookings.filter(matches);
    const inRange = scoped.filter((booking) => {
      const date = bookingDate(booking);
      return date && date >= start && date <= end;
    });
    const paidInRange = inRange.filter(isPaid);
    const current = summarize(scoped, toursById, departures, start, end);
    const previous = summarize(scoped, toursById, departures, prev.start, prev.end);

    const delta = (key) => {
      const now = current[key];
      const before = previous[key];
      if (!before) return now ? 100 : 0;
      return ((now - before) / Math.abs(before)) * 100;
    };

    // Sparklines: chia kỳ thành 12 điểm theo chỉ số chính
    const paidRevenueInRange = paidInRange.reduce((sum, item) => sum + num(item.total_price), 0);
    const sparkOf = (valueOf) => {
      const buckets = makeBuckets(start, end, (end - start) / 86400000 > 60 ? "week" : "day").slice(0, 12);
      return buckets.map((bucket) =>
        inRange.reduce((sum, booking) => {
          const date = bookingDate(booking);
          return date && date >= bucket.start && date < bucket.end ? sum + valueOf(booking) : sum;
        }, 0),
      );
    };

    const kpis = [
      { key: "revenue", label: "Doanh thu đã thanh toán", value: current.revenue, delta: delta("revenue"), spark: sparkOf((b) => (isPaid(b) ? num(b.total_price) : 0)) },
      { key: "expected", label: "Doanh thu dự kiến", value: current.expected, delta: delta("expected"), spark: sparkOf((b) => (b.status === "Đã xác nhận" && !isPaid(b) ? num(b.total_price) : 0)) },
      { key: "orders", label: "Tổng số đơn", value: current.orders, format: "number", delta: delta("orders"), spark: sparkOf(() => 1) },
      { key: "aov", label: "Giá trị đơn trung bình", value: current.aov, delta: delta("aov"), spark: sparkOf((b) => (b.status !== "Đã hủy" ? num(b.total_price) : 0)) },
      { key: "guests", label: "Tổng số khách", value: current.guests, format: "number", delta: delta("guests"), spark: sparkOf((b) => (b.status !== "Đã hủy" ? pax(b) : 0)) },
      { key: "cancelRate", label: "Tỷ lệ hủy", value: current.cancelRate, format: "percent", delta: delta("cancelRate"), spark: sparkOf((b) => (b.status === "Đã hủy" ? 1 : 0)) },
      { key: "fillRate", label: "Tỷ lệ lấp đầy chỗ", value: current.fillRate, format: "percent", delta: delta("fillRate"), spark: [] },
      { key: "receivable", label: "Công nợ phải thu", value: current.receivable, delta: delta("receivable"), spark: sparkOf((b) => (b.status !== "Đã hủy" && !isPaid(b) ? num(b.total_price) : 0)) },
    ];

    const series = {
      day: seriesFor(scoped, start, end, "day", shift),
      week: seriesFor(scoped, start, end, "week", shift),
      month: seriesFor(scoped, start, end, "month", shift),
      quarter: seriesFor(scoped, start, end, "quarter", shift),
    };

    const groupTotals = { domestic: 0, international: 0, service: 0 };
    paidInRange.forEach((booking) => {
      const tour = toursById.get(booking.tour_id);
      if (!tour) groupTotals.service += num(booking.total_price);
      else groupTotals[tour.scope === "international" ? "international" : "domestic"] += num(booking.total_price);
    });
    const groups = [
      { name: GROUP_LABEL.domestic, value: groupTotals.domestic },
      { name: GROUP_LABEL.international, value: groupTotals.international },
      ...(groupTotals.service ? [{ name: "Dịch vụ khác", value: groupTotals.service }] : []),
    ];

    const tourStats = new Map();
    inRange.filter((booking) => booking.status !== "Đã hủy").forEach((booking) => {
      const tour = toursById.get(booking.tour_id);
      const entry = tourStats.get(booking.tour_id) || {
        id: booking.tour_id,
        name: tour?.title || booking.tour_title || "Tour",
        revenue: 0,
        guests: 0,
      };
      entry.revenue += isPaid(booking) ? num(booking.total_price) : 0;
      entry.guests += pax(booking);
      tourStats.set(booking.tour_id, entry);
    });
    const topTours = [...tourStats.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    const channelTotals = {};
    paidInRange.forEach((booking) => {
      const key = booking.channel || "Khác";
      channelTotals[key] = (channelTotals[key] || 0) + num(booking.total_price);
    });
    const channels = Object.entries(channelTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const destinationTotals = {};
    paidInRange.forEach((booking) => {
      const tour = toursById.get(booking.tour_id);
      const key = tour?.destination || "Khác";
      destinationTotals[key] = (destinationTotals[key] || 0) + num(booking.total_price);
    });
    const destinations = Object.entries(destinationTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const valid = inRange.filter((booking) => booking.status !== "Đã hủy");
    const confirmed = valid.filter((booking) => booking.status === "Đã xác nhận" || isPaid(booking));
    const funnel = [
      { step: "Yêu cầu đặt tour", value: inRange.length },
      { step: "Giữ chỗ hợp lệ", value: valid.length },
      { step: "Đã xác nhận", value: confirmed.length },
      { step: "Đã thanh toán", value: valid.filter(isPaid).length },
    ];

    const profitSeries = [];
    for (let i = 11; i >= 0; i -= 1) {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
      const stats = summarize(scoped, toursById, departures, monthStart, monthEnd);
      profitSeries.push({
        label: `T${monthStart.getMonth() + 1}`,
        revenue: stats.revenue,
        cost: stats.cost,
        profit: stats.profit,
      });
    }

    const now = new Date();
    const pendingOld = bookings.filter((booking) => {
      if (booking.status !== "Chờ xác nhận") return false;
      const created = bookingDate(booking);
      return created && now - created > 30 * 60 * 1000;
    }).length;
    const inSevenDays = addDays(now, 7);
    const upcoming = departures
      .filter((dep) => {
        const date = parse(dep.departure_date);
        return date && date >= startOfDay(now) && date <= inSevenDays && dep.status !== "Đã hủy";
      })
      .sort((a, b) => new Date(a.departure_date) - new Date(b.departure_date));

    const lowFill = upcoming.filter((dep) => num(dep.seats_booked) < num(dep.seats_total) * 0.6).length;
    const nearFull = departures.filter((dep) => {
      const date = parse(dep.departure_date);
      return date && date >= startOfDay(now) && num(dep.seats_total) > 0 && num(dep.seats_booked) / num(dep.seats_total) >= 0.9;
    }).length;
    const overdue = bookings.filter((booking) => {
      if (isPaid(booking) || booking.status === "Đã hủy") return false;
      const created = bookingDate(booking);
      return created && now - created > 7 * 86400000;
    }).length;
    const refunds = bookings.filter((booking) => booking.status === "Đã hủy" && isPaid(booking)).length;

    const alerts = [
      { key: "pending", label: "Đơn chờ xác nhận quá 30 phút", count: pendingOld, tone: "warning", to: "/admin/bookings" },
      { key: "lowFill", label: "Tour khởi hành 7 ngày tới còn thiếu khách", count: lowFill, tone: "info", to: "/admin/departures" },
      { key: "nearFull", label: "Tour sắp hết chỗ", count: nearFull, tone: "danger", to: "/admin/departures" },
      { key: "overdue", label: "Thanh toán quá hạn", count: overdue, tone: "danger", to: "/admin/payments" },
      { key: "refunds", label: "Yêu cầu hủy / hoàn tiền", count: refunds, tone: "neutral", to: "/admin/refunds" },
    ];

    const latest = [...scoped]
      .sort((a, b) => (bookingDate(b)?.getTime() || 0) - (bookingDate(a)?.getTime() || 0))
      .slice(0, 8)
      .map((booking) => ({
        id: booking.id,
        code: booking.booking_code,
        customer: booking.customer_name,
        phone: booking.customer_phone,
        tour: booking.tour_title,
        pax: pax(booking),
        departure: booking.departure_date,
        created: booking.booking_date || booking.created_date,
        total: num(booking.total_price),
        status: booking.status,
        payment_status: booking.payment_status || "Unpaid",
        channel: booking.channel || "Khác",
      }));

    return {
      range: { start: start.toISOString(), end: end.toISOString(), preset: data.range || "30d" },
      kpis,
      current,
      previous,
      series,
      groups,
      topTours,
      channels,
      destinations,
      funnel,
      profitSeries,
      alerts,
      upcoming: upcoming.slice(0, 8).map((dep) => ({
        id: dep.id,
        tour: dep.tour_title,
        date: dep.departure_date,
        booked: num(dep.seats_booked),
        total: num(dep.seats_total),
        guide: dep.guide_name,
        status: dep.status,
      })),
      latest,
      paidCount: paidInRange.length,
      paidRevenue: paidRevenueInRange,
      options: {
        destinations: [...new Set(tours.map((tour) => tour.destination).filter(Boolean))].sort(),
        sales: [...new Set(bookings.map((booking) => booking.sale_owner).filter(Boolean))].sort(),
        channels: [...new Set(["Website", "Facebook", "Zalo", "Hotline", "Đại lý", "Walk-in"])],
      },
    };
  });

export const searchAdmin = createServerFn({ method: "GET" })
  .validator(z.object({ q: z.string().trim().min(1).max(60) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const regex = data.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const [bookingsRes, customersRes, toursRes] = await Promise.all([
      base44.entities.Booking.filter(
        { $or: [{ booking_code: { $regex: regex } }, { customer_name: { $regex: regex } }, { customer_phone: { $regex: regex } }] },
        { limit: 5 },
      ),
      base44.entities.Customer.filter(
        { $or: [{ full_name: { $regex: regex } }, { phone: { $regex: regex } }] },
        { limit: 5 },
      ),
      base44.entities.Tour.filter({ title: { $regex: regex } }, { limit: 5 }),
    ]);
    return {
      bookings: asArray(bookingsRes).map((item) => ({ id: item.id, code: item.booking_code, name: item.customer_name, tour: item.tour_title, total: num(item.total_price) })),
      customers: asArray(customersRes).map((item) => ({ id: item.id, name: item.full_name, phone: item.phone, city: item.city })),
      tours: asArray(toursRes).map((item) => ({ id: item.id, name: item.title, slug: item.slug, scope: item.scope })),
    };
  });

export const createAdminBooking = createServerFn({ method: "POST" })
  .validator(
    z.object({
      tour_id: z.string().min(1).max(64),
      customer_name: z.string().trim().min(2).max(80),
      customer_phone: z.string().trim().min(8).max(20),
      customer_email: z.string().trim().max(120).optional(),
      departure_date: z.string().min(8).max(30),
      adults_count: z.number().int().min(1).max(60),
      children_count: z.number().int().min(0).max(40),
      channel: z.enum(["Website", "Facebook", "Zalo", "Hotline", "Đại lý", "Walk-in"]),
      sale_owner: z.string().trim().max(60).optional(),
      note: z.string().trim().max(500).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44().asServiceRole;
    const tour = await base44.entities.Tour.get(data.tour_id);
    if (!tour) return { error: "Không tìm thấy tour đã chọn." };
    const adultUnit =
      num(tour.discount_percent) > 0
        ? Math.round((num(tour.price_adult) * (100 - num(tour.discount_percent))) / 100)
        : num(tour.price_adult);
    const total = adultUnit * data.adults_count + num(tour.price_child) * data.children_count;

    let code = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const clash = await base44.entities.Booking.count({ booking_code: code });
      if (!clash) break;
      code = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const booking = await base44.entities.Booking.create({
      booking_code: code,
      booking_date: new Date().toISOString(),
      tour_id: tour.id,
      tour_title: tour.title,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email || "",
      departure_date: data.departure_date,
      adults_count: data.adults_count,
      children_count: data.children_count,
      total_price: total,
      paid_amount: 0,
      special_requests: data.note || "",
      channel: data.channel,
      sale_owner: data.sale_owner || "",
      status: "Chờ xác nhận",
      payment_status: "Unpaid",
      passengers: [
        { full_name: data.customer_name, type: "Người lớn" },
        ...Array.from({ length: data.children_count }, () => ({ full_name: "Trẻ em", type: "Trẻ em" })),
      ],
      activities: [
        {
          at: new Date().toISOString(),
          type: "created",
          text: `Đơn được tạo thủ công · kênh ${data.channel}`,
        },
      ],
    });
    return { booking_code: booking.booking_code, total_price: total };
  });