import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));

export const getTours = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const base44 = context.getBase44();
  const rows = await base44.entities.Tour.list({ sort: "-created_date", limit: 200 });
  return asArray(rows);
});

export const getTourBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(200) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const rows = asArray(await base44.entities.Tour.filter({ slug: data.slug }, { limit: 1 }));
    return rows[0] ?? null;
  });

export const getReviewsForTour = createServerFn({ method: "GET" })
  .validator(z.object({ tour_slug: z.string().min(1).max(200) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const rows = await base44.entities.Review.filter(
      { tour_slug: data.tour_slug },
      { sort: "-created_date", limit: 50 },
    );
    return asArray(rows);
  });

export const getPosts = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const base44 = context.getBase44();
  const rows = await base44.entities.BlogPost.list({ sort: "-published_at", limit: 100 });
  return asArray(rows);
});

export const getActiveServices = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const base44 = context.getBase44();
  const rows = await base44.entities.Service.filter({ is_active: true }, { limit: 100 });
  return asArray(rows);
});

export const getPostBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(200) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const rows = asArray(await base44.entities.BlogPost.filter({ slug: data.slug }, { limit: 1 }));
    return rows[0] ?? null;
  });

const bookingInput = z.object({
  tour_id: z.string().min(1).max(64),
  customer_name: z.string().trim().min(2).max(80),
  customer_phone: z.string().trim().min(8).max(20),
  customer_email: z.string().trim().email().max(120),
  departure_date: z.string().min(8).max(20),
  adults_count: z.number().int().min(1).max(20),
  children_count: z.number().int().min(0).max(20),
  special_requests: z.string().trim().max(600).optional(),
});

export const createBooking = createServerFn({ method: "POST" })
  .validator(bookingInput)
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44().asServiceRole;

    const tour = await base44.entities.Tour.get(data.tour_id);
    if (!tour) return { error: "Không tìm thấy tour bạn chọn." };

    const adultUnit =
      Number(tour.discount_percent) > 0
        ? Math.round((Number(tour.price_adult) * (100 - Number(tour.discount_percent))) / 100)
        : Number(tour.price_adult) || 0;
    const total = adultUnit * data.adults_count + (Number(tour.price_child) || 0) * data.children_count;

    let code = "";
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const candidate = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
      const clash = await base44.entities.Booking.count({ booking_code: candidate });
      if (!clash) {
        code = candidate;
        break;
      }
    }
    if (!code) code = `BK-${Date.now().toString().slice(-6)}`;

    const booking = await base44.entities.Booking.create({
      booking_code: code,
      tour_id: tour.id,
      tour_title: tour.title,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email,
      departure_date: data.departure_date,
      adults_count: data.adults_count,
      children_count: data.children_count,
      total_price: total,
      special_requests: data.special_requests || "",
      status: "Chờ xác nhận",
      payment_status: "Unpaid",
    });

    try {
      await base44.integrations.Core.SendEmail({
        to: data.customer_email,
        subject: `GenTravel xác nhận yêu cầu đặt tour ${code}`,
        body: [
          `Xin chào ${data.customer_name},`,
          "",
          `GenTravel đã nhận được yêu cầu đặt tour "${tour.title}".`,
          `Mã đặt chỗ của bạn: ${code}`,
          `Ngày khởi hành: ${data.departure_date}`,
          `Số khách: ${data.adults_count} người lớn, ${data.children_count} trẻ em`,
          `Tạm tính: ${total.toLocaleString("vi-VN")}₫`,
          "",
          "Chuyên viên GenTravel sẽ gọi xác nhận trong vòng 30 phút làm việc. Hotline hỗ trợ: 1900 6789.",
        ].join("\n"),
      });
    } catch (emailError) {
      // Không để lỗi gửi email làm mất yêu cầu đặt tour đã ghi nhận.
    }

    return {
      booking_code: booking.booking_code,
      total_price: booking.total_price,
      tour_title: booking.tour_title,
      departure_date: booking.departure_date,
      adults_count: booking.adults_count,
      children_count: booking.children_count,
      customer_phone: booking.customer_phone,
    };
  });

export const markTransferSubmitted = createServerFn({ method: "POST" })
  .validator(
    z.object({
      booking_code: z.string().trim().min(3).max(40),
      phone: z.string().trim().min(8).max(20),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44().asServiceRole;
    const rows = asArray(
      await base44.entities.Booking.filter({ booking_code: data.booking_code }, { limit: 1 }),
    );
    const booking = rows[0];
    if (!booking) return { error: "Không tìm thấy đơn đặt tour." };

    const normalize = (value) => String(value || "").replace(/[\s.-]/g, "");
    if (normalize(booking.customer_phone) !== normalize(data.phone)) {
      return { error: "Thông tin đơn đặt tour không khớp." };
    }
    if (booking.payment_status === "Paid") return { ok: true, payment_status: "Paid" };

    await base44.entities.Booking.update(booking.id, { payment_status: "Pending Verification" });
    return { ok: true, payment_status: "Pending Verification" };
  });

export const getBookingPaymentStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      booking_code: z.string().trim().min(3).max(40),
      phone: z.string().trim().min(8).max(20),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44().asServiceRole;
    const rows = asArray(
      await base44.entities.Booking.filter({ booking_code: data.booking_code }, { limit: 1 }),
    );
    const booking = rows[0];
    if (!booking) return { error: "Không tìm thấy đơn đặt tour." };

    const normalize = (value) => String(value || "").replace(/[\s.-]/g, "");
    if (normalize(booking.customer_phone) !== normalize(data.phone)) {
      return { error: "Thông tin đơn đặt tour không khớp." };
    }

    return { payment_status: booking.payment_status || "Unpaid", status: booking.status };
  });

export const createReview = createServerFn({ method: "POST" })
  .validator(
    z.object({
      tour_id: z.string().min(1).max(64),
      tour_slug: z.string().min(1).max(200),
      customer_name: z.string().trim().min(2).max(60),
      rating: z.number().int().min(1).max(5),
      comment: z.string().trim().max(1000).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44().asServiceRole;

    const review = await base44.entities.Review.create({
      tour_id: data.tour_id,
      tour_slug: data.tour_slug,
      customer_name: data.customer_name,
      rating: data.rating,
      comment: data.comment || "",
    });

    const { rows = [] } = await base44.entities.Review.aggregate({
      query: { tour_slug: data.tour_slug },
      groupBy: "tour_slug",
      avg: ["rating"],
    });
    const stats = rows[0];
    if (stats) {
      await base44.entities.Tour.update(data.tour_id, {
        rating: Math.round(Number(stats.avg_rating) * 10) / 10,
        review_count: stats.count,
      });
    }

    return review;
  });