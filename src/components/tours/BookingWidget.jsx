import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, Loader2, Minus, Plus, ShieldCheck } from "lucide-react";
import BookingConfirmDialog from "@/components/booking/BookingConfirmDialog";
import { createBooking } from "@/lib/server-fns";
import { durationLabel, finalPrice, formatVND } from "@/lib/format";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15";

export default function BookingWidget({ tour }) {
  const submitBooking = useServerFn(createBooking);
  const unitPrice = finalPrice(tour);
  const childPrice = Number(tour.price_child) || 0;

  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const total = unitPrice * adults + childPrice * children;
  const today = new Date().toISOString().slice(0, 10);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!date) return setError("Vui lòng chọn ngày khởi hành.");
    if (form.name.trim().length < 2) return setError("Vui lòng nhập họ tên của bạn.");
    if (!/^[0-9+\s.-]{8,20}$/.test(form.phone.trim())) return setError("Số điện thoại chưa hợp lệ.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError("Email chưa hợp lệ.");

    setSubmitting(true);
    try {
      const res = await submitBooking({
        data: {
          tour_id: tour.id,
          customer_name: form.name.trim(),
          customer_phone: form.phone.trim(),
          customer_email: form.email.trim(),
          departure_date: date,
          adults_count: adults,
          children_count: children,
          special_requests: form.notes.trim(),
        },
      });
      if (res?.error) {
        setError(res.error);
        return;
      }
      setResult(res);
      setPaymentOpen(true);
      setForm({ name: "", phone: "", email: "", notes: "" });
    } catch {
      setError("Chưa gửi được yêu cầu. Vui lòng gọi 1900 6789 để được hỗ trợ ngay.");
    } finally {
      setSubmitting(false);
    }
  };

  const counter = (value, setter, min, label, hint) => (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-[11px] text-slate-500">{hint}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Giảm ${label}`}
          onClick={() => setter(Math.max(min, value - 1))}
          disabled={value <= min}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-brand hover:text-brand disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-ink">{value}</span>
        <button
          type="button"
          aria-label={`Tăng ${label}`}
          onClick={() => setter(Math.min(20, value + 1))}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-brand hover:text-brand"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside id="booking" className="scroll-mt-24 rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Giá tour từ</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="font-heading text-2xl font-extrabold text-cta">{formatVND(unitPrice)}</span>
          <span className="pb-1 text-xs text-slate-500">/khách</span>
        </div>
        <div className="mt-3 rounded-xl bg-cloud px-3 py-2 text-[12.5px] font-medium text-slate-600">
          {durationLabel(tour.duration_days, tour.duration_nights)} · Khởi hành từ {tour.departure_point}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
              <CalendarDays className="h-3.5 w-3.5 text-brand" /> Ngày khởi hành
            </span>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(event) => setDate(event.target.value)}
              className={inputClass}
              required
            />
          </label>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 px-3">
            {counter(adults, setAdults, 1, "Người lớn", `${formatVND(unitPrice)} / khách`)}
            {counter(children, setChildren, 0, "Trẻ em (2 – 11 tuổi)", `${formatVND(childPrice)} / bé`)}
          </div>

          <div className="space-y-2.5">
            <input
              type="text"
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="Họ và tên"
              className={inputClass}
              autoComplete="name"
              required
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => setField("phone", event.target.value)}
              placeholder="Số điện thoại"
              className={inputClass}
              autoComplete="tel"
              required
            />
            <input
              type="email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              placeholder="Email nhận xác nhận"
              className={inputClass}
              autoComplete="email"
              required
            />
            <textarea
              value={form.notes}
              onChange={(event) => setField("notes", event.target.value)}
              placeholder="Yêu cầu đặc biệt (phòng gia đình, ăn chay…)"
              rows={2}
              maxLength={600}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-sm font-medium text-slate-600">Tạm tính</span>
            <span className="font-heading text-xl font-extrabold text-ink">{formatVND(total)}</span>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cta text-sm font-semibold text-white transition hover:bg-cta-hover disabled:opacity-70"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Đang gửi yêu cầu…" : "Gửi yêu cầu đặt tour"}
          </button>

          <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-slate-500">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
            Sau khi gửi yêu cầu, chuyên viên GenTravel sẽ liên hệ xác nhận đơn và hướng dẫn thanh toán.
          </p>
        </form>

        {result && !paymentOpen && (
          <div className="mt-3 rounded-xl border border-brand/20 bg-brand-50 p-3">
            <p className="text-[12.5px] font-semibold text-brand-900">
              Đơn {result.booking_code} đã ghi nhận · chờ xác nhận
            </p>
            <button
              type="button"
              onClick={() => setPaymentOpen(true)}
              className="mt-1 text-[12.5px] font-semibold text-brand underline"
            >
              Xem lại xác nhận đặt tour
            </button>
          </div>
        )}
      </aside>

      <BookingConfirmDialog booking={result} open={paymentOpen} onOpenChange={setPaymentOpen} />
    </>
  );
}