import { useState } from "react";
import { Loader2, Wallet } from "lucide-react";
import { PAYMENT_LABEL, PAYMENT_METHODS, PAYMENT_STYLE, paidOf } from "@/lib/booking-status";
import { formatDateVN, formatVND } from "@/lib/format";

const inputClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[12.5px] text-ink outline-none transition focus:border-brand";

export default function BookingPaymentPanel({ booking, payments, onAddPayment, busy }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Chuyển khoản");
  const [note, setNote] = useState("");

  const total = Number(booking.total_price) || 0;
  const paid = paidOf(booking);
  const remaining = Math.max(total - paid, 0);
  const percent = total ? Math.min(Math.round((paid / total) * 100), 100) : 0;

  const submit = async (event) => {
    event.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    const ok = await onAddPayment({ amount: value, method, note });
    if (ok) {
      setAmount("");
      setNote("");
    }
  };

  return (
    <section className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          <Wallet className="h-3.5 w-3.5" /> Thanh toán
        </h3>
        <span className={`rounded-md border px-2 py-0.5 text-[10.5px] font-semibold ${PAYMENT_STYLE[booking.payment_status] || PAYMENT_STYLE.Unpaid}`}>
          {PAYMENT_LABEL[booking.payment_status] || PAYMENT_LABEL.Unpaid}
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-cloud px-2 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-slate-400">Giá trị</p>
          <p className="text-[12.5px] font-semibold text-ink tnum">{formatVND(total)}</p>
        </div>
        <div className="rounded-lg bg-emerald-50/70 px-2 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-emerald-700/70">Đã thu</p>
          <p className="text-[12.5px] font-semibold text-emerald-700 tnum">{formatVND(paid)}</p>
        </div>
        <div className="rounded-lg bg-amber-50/70 px-2 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-amber-700/70">Còn lại</p>
          <p className="text-[12.5px] font-semibold text-amber-700 tnum">{formatVND(remaining)}</p>
        </div>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-right text-[10.5px] text-slate-400">{percent}% đã thanh toán</p>

      <div className="mt-2 space-y-1.5">
        {payments.length === 0 && <p className="text-[12px] text-slate-400">Chưa ghi nhận giao dịch nào.</p>}
        {payments.map((payment) => (
          <div key={payment.id} className="flex items-start justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-1.5">
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-ink">{payment.method}</p>
              <p className="text-[10.5px] text-slate-400">
                {formatDateVN(payment.paid_at, true)}
                {payment.note ? ` · ${payment.note}` : ""}
              </p>
            </div>
            <span className="shrink-0 text-[12px] font-semibold text-emerald-700 tnum">+{formatVND(payment.amount)}</span>
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <form onSubmit={submit} className="mt-2.5 space-y-2 rounded-lg bg-cloud/70 p-2.5">
          <p className="text-[11px] font-semibold text-slate-500">Ghi nhận thanh toán</p>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              step="1000"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Số tiền (VND)"
              className={inputClass}
            />
            <select value={method} onChange={(event) => setMethod(event.target.value)} className={inputClass}>
              {PAYMENT_METHODS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ghi chú (tùy chọn)" className={inputClass} />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setAmount(String(remaining))}
              className="text-[11px] font-semibold text-brand hover:underline"
            >
              Thu toàn bộ còn lại
            </button>
            <button
              type="submit"
              disabled={busy === "payment" || !Number(amount)}
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-brand px-3 text-[12px] font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {busy === "payment" && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Ghi nhận
            </button>
          </div>
        </form>
      )}
    </section>
  );
}