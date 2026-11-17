import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { area, field, labelText } from "@/components/admin/tours/form-parts";
import { formatVND } from "@/lib/format";
import { receivedForBooking } from "@/lib/payment-utils";
import { logActivity } from "@/lib/activity";

const METHODS = ["Chuyển khoản", "VNPay", "MoMo", "Tiền mặt", "VietQR", "Thẻ tín dụng", "Đại lý thu"];
const CLOSED = ["Đã hủy", "Hoàn tiền"];

const today = () => new Date().toISOString().slice(0, 10);

export default function PaymentDialog({ open, onOpenChange, bookings, partners, payments, presetBooking, presetPartner, onSaved }) {
  const { user } = useAuth();
  const [direction, setDirection] = useState("Thu từ khách");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    const base = {
      booking_code: presetBooking?.booking_code || "",
      partner_id: presetPartner?.id || "",
      amount: "",
      kind: "Thanh toán còn lại",
      method: "Chuyển khoản",
      status: "Đã thanh toán",
      paid_at: today(),
      receipt_no: "",
      note: "",
    };
    setDirection(presetPartner ? "Chi đối tác" : "Thu từ khách");
    setForm(base);
  }, [open, presetBooking, presetPartner]);

  if (!form) return null;

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const booking = bookings.find((item) => item.booking_code === form.booking_code);
  const received = booking ? receivedForBooking(booking, payments) : 0;
  const remaining = booking ? Math.max((Number(booking.total_price) || 0) - received, 0) : 0;
  const partner = partners.find((item) => item.id === form.partner_id);

  const handleSave = async () => {
    const amount = Number(form.amount) || 0;
    if (amount <= 0) {
      setError("Vui lòng nhập số tiền lớn hơn 0.");
      return;
    }
    if (direction === "Thu từ khách" && !booking) {
      setError("Vui lòng chọn đơn đặt tour.");
      return;
    }
    if (direction === "Chi đối tác" && !partner) {
      setError("Vui lòng chọn đối tác cần chi tiền.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await base44.entities.Payment.create({
        direction,
        booking_code: direction === "Thu từ khách" ? booking.booking_code : "",
        booking_id: direction === "Thu từ khách" ? booking.id : "",
        tour_id: direction === "Thu từ khách" ? booking.tour_id : "",
        customer_name: direction === "Thu từ khách" ? booking.customer_name : "",
        partner_id: direction === "Chi đối tác" ? partner.id : "",
        partner_name: direction === "Chi đối tác" ? partner.name : "",
        amount,
        kind: direction === "Chi đối tác" ? "Chi phí đối tác" : form.kind,
        method: form.method,
        status: form.status,
        paid_at: form.paid_at ? new Date(`${form.paid_at}T09:00:00`).toISOString() : new Date().toISOString(),
        receipt_no: form.receipt_no.trim(),
        note: form.note.trim(),
        reconciled: false,
      });

      if (direction === "Thu từ khách" && form.status === "Đã thanh toán") {
        const total = Number(booking.total_price) || 0;
        const newPaid = Math.min(received + amount, total);
        const paymentStatus = newPaid >= total && total > 0 ? "Paid" : newPaid > 0 ? "Partial" : "Unpaid";
        await base44.entities.Booking.update(booking.id, {
          paid_amount: newPaid,
          payment_status: paymentStatus,
        });
      }

      await logActivity({
        module: "Thanh toán",
        action: direction === "Thu từ khách" ? "Ghi nhận thu tiền" : "Ghi nhận chi đối tác",
        detail: `${formatVND(amount)} · ${direction === "Thu từ khách" ? booking.booking_code : partner.name} · ${form.method}`,
        entity_id: direction === "Thu từ khách" ? booking.id : partner.id,
        actor: user?.full_name || user?.email || "",
      });

      onSaved();
      onOpenChange(false);
    } catch {
      setError("Chưa lưu được giao dịch. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const bookingOptions = bookings.filter((item) => !CLOSED.includes(item.status));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-xl overflow-y-auto">
        <DialogTitle className="font-heading text-lg font-extrabold text-ink">Ghi nhận giao dịch</DialogTitle>
        <DialogDescription className="text-[12.5px] text-slate-500">Thu tiền khách hoặc chi trả đối tác, theo dõi đối soát sau đó.</DialogDescription>

        <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-xl bg-cloud p-1">
          {["Thu từ khách", "Chi đối tác"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setDirection(item);
                set("kind", item === "Chi đối tác" ? "Chi phí đối tác" : "Thanh toán còn lại");
              }}
              className={`h-9 rounded-lg text-[12.5px] font-semibold ${direction === item ? "bg-white text-brand shadow-sm" : "text-slate-500"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {direction === "Thu từ khách" ? (
            <div className="sm:col-span-2">
              <label className={labelText}>Đơn đặt tour</label>
              <select className={field} value={form.booking_code} onChange={(e) => set("booking_code", e.target.value)}>
                <option value="">Chọn đơn đặt tour</option>
                {bookingOptions.map((item) => (
                  <option key={item.id} value={item.booking_code}>
                    {item.booking_code} · {item.customer_name} · {item.tour_title}
                  </option>
                ))}
              </select>
              {booking ? (
                <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-cloud px-3 py-2 text-[11.5px]">
                  <div>
                    <p className="text-slate-400">Giá trị đơn</p>
                    <p className="font-semibold text-ink tnum">{formatVND(booking.total_price)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Đã thu</p>
                    <p className="font-semibold text-ink tnum">{formatVND(received)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Còn lại</p>
                    <p className="font-semibold text-brand tnum">{formatVND(remaining)}</p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="sm:col-span-2">
              <label className={labelText}>Đối tác</label>
              <select className={field} value={form.partner_id} onChange={(e) => set("partner_id", e.target.value)}>
                <option value="">Chọn đối tác</option>
                {partners.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.type}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={labelText}>Số tiền (VND)</label>
            <input type="number" min={0} className={field} value={form.amount} onChange={(e) => set("amount", e.target.value)} />
            {direction === "Thu từ khách" && booking ? (
              <div className="mt-1 flex gap-1.5">
                <button type="button" onClick={() => set("amount", Math.round(remaining * 0.3))} className="rounded-md border border-slate-200 px-2 py-1 text-[10.5px] font-semibold text-slate-600 hover:text-brand">
                  Cọc 30%
                </button>
                <button type="button" onClick={() => set("amount", remaining)} className="rounded-md border border-slate-200 px-2 py-1 text-[10.5px] font-semibold text-slate-600 hover:text-brand">
                  Thu hết còn lại
                </button>
              </div>
            ) : null}
          </div>
          <div>
            <label className={labelText}>{direction === "Thu từ khách" ? "Nội dung thu" : "Nội dung chi"}</label>
            <select className={field} value={form.kind} onChange={(e) => set("kind", e.target.value)}>
              {direction === "Thu từ khách" ? (
                <>
                  <option>Đặt cọc</option>
                  <option>Thanh toán còn lại</option>
                  <option>Thanh toán toàn bộ</option>
                  <option>Hoàn tiền</option>
                </>
              ) : (
                <option>Chi phí đối tác</option>
              )}
            </select>
          </div>
          <div>
            <label className={labelText}>Phương thức</label>
            <select className={field} value={form.method} onChange={(e) => set("method", e.target.value)}>
              {METHODS.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelText}>Trạng thái</label>
            <select className={field} value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option>Đã thanh toán</option>
              <option>Chờ xử lý</option>
              <option>Thất bại</option>
            </select>
          </div>
          <div>
            <label className={labelText}>Ngày giao dịch</label>
            <input type="date" className={field} value={form.paid_at} onChange={(e) => set("paid_at", e.target.value)} />
          </div>
          <div>
            <label className={labelText}>Số phiếu thu / chi</label>
            <input className={field} value={form.receipt_no} onChange={(e) => set("receipt_no", e.target.value)} placeholder="PT-0012" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelText}>Ghi chú</label>
            <textarea rows={2} className={area} value={form.note} onChange={(e) => set("note", e.target.value)} />
          </div>
        </div>

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => onOpenChange(false)} className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600">
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-[13px] font-semibold text-white disabled:opacity-70"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Lưu giao dịch
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}