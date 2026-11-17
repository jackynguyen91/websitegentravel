import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { paidOf } from "@/lib/booking-status";

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));
const num = (value) => Number(value) || 0;
const parse = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const bookingTime = (booking) => parse(booking.booking_date)?.getTime() || parse(booking.created_date)?.getTime() || 0;
const normalizePhone = (value) => String(value || "").replace(/[\s.-]/g, "");

function statsByCustomer(bookings) {
  const map = new Map();
  bookings.forEach((booking) => {
    const keys = [booking.customer_id, normalizePhone(booking.customer_phone)].filter(Boolean);
    keys.forEach((key) => {
      const entry = map.get(key) || { orders: 0, spend: 0, lastOrder: 0, guests: 0, cancelled: 0 };
      entry.orders += 1;
      entry.spend += paidOf(booking);
      entry.guests += num(booking.adults_count) + num(booking.children_count);
      if (booking.status === "Đã hủy") entry.cancelled += 1;
      entry.lastOrder = Math.max(entry.lastOrder, bookingTime(booking));
      map.set(key, entry);
    });
  });
  return map;
}

export const listAdminCustomers = createServerFn({ method: "GET" })
  .validator(
    z.object({
      q: z.string().max(80).optional(),
      tier: z.string().max(20).optional(),
      tag: z.string().max(40).optional(),
      sort: z.string().max(20).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const [customerRows, bookingRows] = await Promise.all([
      base44.entities.Customer.list({ limit: 500 }),
      base44.entities.Booking.list({ limit: 1000 }),
    ]);
    const customers = asArray(customerRows);
    const bookings = asArray(bookingRows);
    const stats = statsByCustomer(bookings);

    const text = (data.q || "").trim().toLowerCase();
    const rows = customers
      .map((customer) => {
        const byId = stats.get(customer.id);
        const byPhone = stats.get(normalizePhone(customer.phone));
        const merged = {
          orders: Math.max(byId?.orders || 0, byPhone?.orders || 0),
          spend: Math.max(byId?.spend || 0, byPhone?.spend || 0),
          lastOrder: Math.max(byId?.lastOrder || 0, byPhone?.lastOrder || 0),
          guests: Math.max(byId?.guests || 0, byPhone?.guests || 0),
        };
        return {
          id: customer.id,
          full_name: customer.full_name,
          phone: customer.phone,
          email: customer.email || "",
          city: customer.city || "",
          tier: customer.tier || "Mới",
          tags: customer.tags || [],
          birthday: customer.birthday || "",
          owner: customer.owner || "",
          source_channel: customer.source_channel || "",
          note: customer.note || "",
          orders: merged.orders,
          spend: merged.spend,
          guests: merged.guests,
          last_order: merged.lastOrder ? new Date(merged.lastOrder).toISOString() : "",
          created: customer.created_date,
        };
      })
      .filter((customer) => {
        if (data.tier && data.tier !== "all" && customer.tier !== data.tier) return false;
        if (data.tag && data.tag !== "all" && !customer.tags.includes(data.tag)) return false;
        if (!text) return true;
        return [customer.full_name, customer.phone, customer.email, customer.city]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(text));
      });

    const SORTERS = {
      "spend-desc": (a, b) => b.spend - a.spend,
      "orders-desc": (a, b) => b.orders - a.orders,
      newest: (a, b) => new Date(b.created || 0) - new Date(a.created || 0),
      name: (a, b) => String(a.full_name).localeCompare(String(b.full_name), "vi"),
    };
    rows.sort(SORTERS[data.sort] || SORTERS["spend-desc"]);

    const tierCounts = { "Mới": 0, "Thân thiết": 0, "VIP": 0 };
    customers.forEach((customer) => {
      const tier = customer.tier || "Mới";
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    });

    return {
      items: rows.slice(0, 300),
      total: rows.length,
      tierCounts,
      totals: {
        spend: rows.reduce((sum, customer) => sum + customer.spend, 0),
        orders: rows.reduce((sum, customer) => sum + customer.orders, 0),
      },
      tags: [...new Set(customers.flatMap((customer) => customer.tags || []))].sort(),
    };
  });

export const getCustomerDetail = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1).max(64) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const customer = await base44.entities.Customer.get(data.id).catch((error) => {
      if (error?.status === 404) return null;
      throw error;
    });
    if (!customer) return null;

    const byId = asArray(await base44.entities.Booking.filter({ customer_id: customer.id }, { sort: "-booking_date", limit: 100 }));
    const byPhone = asArray(
      await base44.entities.Booking.filter({ customer_phone: customer.phone }, { sort: "-booking_date", limit: 100 }),
    );
    const seen = new Set();
    const bookings = [...byId, ...byPhone]
      .filter((booking) => {
        if (seen.has(booking.id)) return false;
        seen.add(booking.id);
        return true;
      })
      .sort((a, b) => bookingTime(b) - bookingTime(a));

    const spend = bookings.reduce((sum, booking) => sum + paidOf(booking), 0);
    const guests = bookings.reduce((sum, booking) => sum + num(booking.adults_count) + num(booking.children_count), 0);
    const lastOrder = bookings[0] ? bookings[0].booking_date || bookings[0].created_date : "";

    return {
      customer,
      stats: {
        orders: bookings.length,
        spend,
        guests,
        lastOrder,
        upcoming: bookings.filter((booking) => {
          const date = parse(booking.departure_date);
          return date && date > new Date() && booking.status !== "Đã hủy";
        }).length,
      },
      bookings: bookings.slice(0, 40).map((booking) => ({
        id: booking.id,
        code: booking.booking_code,
        tour_title: booking.tour_title,
        departure_date: booking.departure_date,
        booking_date: booking.booking_date || booking.created_date,
        total: num(booking.total_price),
        paid: paidOf(booking),
        status: booking.status,
        payment_status: booking.payment_status || "Unpaid",
      })),
    };
  });

export const updateCustomerProfile = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1).max(64),
      tier: z.enum(["Mới", "Thân thiết", "VIP"]).optional(),
      tags: z.array(z.string().trim().min(1).max(30)).max(12).optional(),
      note: z.string().max(1000).optional(),
      birthday: z.string().max(20).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const { id, ...patch } = data;
    const customer = await base44.entities.Customer.update(id, patch);
    return { ok: true, customer };
  });