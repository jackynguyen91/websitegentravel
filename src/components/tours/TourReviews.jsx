import { useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessageSquareQuote, Send, Star } from "lucide-react";
import { createReview } from "@/lib/server-fns";
import { formatDateVN } from "@/lib/format";

const field =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15";

function Stars({ value, size = "h-3.5 w-3.5" }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`${size} ${index < value ? "fill-sun text-sun" : "fill-slate-200 text-slate-200"}`}
        />
      ))}
    </span>
  );
}

export default function TourReviews({ tour, initialReviews = [] }) {
  const submitReview = useServerFn(createReview);
  const router = useRouter();

  const [added, setAdded] = useState([]);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reviews = useMemo(() => {
    const seen = new Set();
    return [...added, ...initialReviews].filter((review) => {
      if (!review?.id || seen.has(review.id)) return false;
      seen.add(review.id);
      return true;
    });
  }, [added, initialReviews]);

  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : Number(tour.rating || 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setDone(false);
    if (form.name.trim().length < 2) return setError("Vui lòng nhập họ tên của bạn.");
    if (!form.rating) return setError("Vui lòng chọn số sao đánh giá.");

    setSubmitting(true);
    try {
      const review = await submitReview({
        data: {
          tour_id: tour.id,
          tour_slug: tour.slug,
          customer_name: form.name.trim(),
          rating: form.rating,
          comment: form.comment.trim(),
        },
      });
      setAdded((prev) => [review, ...prev]);
      setForm({ name: "", rating: 5, comment: "" });
      setDone(true);
      router.invalidate();
    } catch {
      setError("Chưa gửi được đánh giá. Vui lòng thử lại sau ít phút.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="danh-gia" className="mt-10 scroll-mt-24 rounded-2xl border border-slate-100 bg-white p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Khách hàng nói gì</p>
          <h2 className="mt-1 font-heading text-xl font-extrabold text-ink">Đánh giá của khách hàng</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            Chia sẻ cảm nhận của bạn sau chuyến đi để những khách hàng khác yên tâm hơn.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-cloud px-4 py-2.5">
          <span className="font-heading text-2xl font-extrabold text-ink">{average.toFixed(1)}</span>
          <div>
            <Stars value={Math.round(average)} />
            <p className="mt-0.5 text-[11.5px] text-slate-500">{reviews.length} đánh giá</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
              <MessageSquareQuote className="mx-auto h-6 w-6 text-slate-300" />
              <p className="mt-2 text-[13px] text-slate-500">
                Chưa có đánh giá cho tour này. Hãy là người đầu tiên chia sẻ cảm nhận.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 font-heading text-sm font-bold text-brand">
                      {review.customer_name?.charAt(0)?.toUpperCase() || "K"}
                    </span>
                    <div>
                      <p className="text-[13.5px] font-semibold text-ink">{review.customer_name}</p>
                      <p className="text-[11px] text-slate-400">{formatDateVN(review.created_date)}</p>
                    </div>
                  </div>
                  <Stars value={Number(review.rating || 0)} />
                </div>
                {review.comment ? (
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600">{review.comment}</p>
                ) : null}
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="h-fit rounded-2xl border border-slate-100 bg-cloud p-4 sm:p-5">
          <h3 className="font-heading text-base font-bold text-ink">Gửi đánh giá của bạn</h3>
          <p className="mt-1 text-[12px] text-slate-500">Đánh giá của bạn sẽ hiển thị công khai trên trang tour.</p>

          <div className="mt-3">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
              Đánh giá của bạn
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} sao`}
                  onClick={() => setForm((prev) => ({ ...prev, rating: value }))}
                  className="p-0.5"
                >
                  <Star
                    className={`h-6 w-6 transition ${value <= form.rating ? "fill-sun text-sun" : "fill-slate-200 text-slate-200"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 space-y-2.5">
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Họ và tên"
              maxLength={60}
              className={field}
              autoComplete="name"
              required
            />
            <textarea
              value={form.comment}
              onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
              placeholder="Cảm nhận về hướng dẫn viên, lịch trình, dịch vụ…"
              rows={4}
              maxLength={1000}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </div>

          {error && (
            <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">
              {error}
            </p>
          )}
          {done && (
            <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-[12.5px] font-medium text-brand-900">
              Cảm ơn bạn đã gửi đánh giá!
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? "Đang gửi…" : "Gửi đánh giá"}
          </button>
        </form>
      </div>
    </section>
  );
}