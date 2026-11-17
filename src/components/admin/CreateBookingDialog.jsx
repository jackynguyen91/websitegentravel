import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { createAdminBooking } from "@/lib/admin-fns";
import { formatDateVN, finalPrice, formatVND } from "@/lib/format";

const EMPTY = {
  tour_id: "",
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  departure_date: "",
  adults_count: 2,
  children_count: 0,
  channel: "Hotline",
  sale_owner: "",
  note: "",
};

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));
const inputClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[13px] text-ink outline-none transition focus:border-brand";

export default function CreateBookingDialog({ open, onOpenChange }) {
  const createBooking = useServerFn(createAdminBooking);
  const router = useRouter();
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY);
    setError("");
    setDone(null);
    (async () => {
      const rows = await base44.entities.Tour.list({ sort: "title", limit: 200 });
      setTours(asArray(rows));
    })();
  }, [open]);

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  const tour = tours.find((item) => item.id === form.tour_id);
  const estimate = tour
    ? finalPrice(tour) * Number(form.adults_count || 0) + Number(tour.price_child || 0) * Number(form.children_count || 0)
    : 0;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.tour_id) return setError("Vui lòng chọn tour.");
    if (!form.customer_name.trim()) return setError("Vui lòng nhập tên khách hàng.");
    if (form.customer_phone.trim().length < 8) return setError("Số điện thoại chưa hợp lệ.");
    if (!form.departure_date) return setError("Vui lòng chọn ngày khởi hành.");
    setSaving(true);
    try {
      const result = await createBooking({
        data: {
          ...form,
          adults_count: Number(form.adults_count),
          children_count: Number(form.children_count),
        },
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setDone(result);
      toast.success(`Đã tạo đơn ${result.booking_code}`);
      router.invalidate();
    } catch (requestError) {
      setError("Không tạo được đơn. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto sm:rounded-xl">
        <DialogTitle className="text-lg font-semibold text-ink">Tạo đơn đặt tour</DialogTitle>
        <DialogDescription className="text-[12.5px] text-slate-500">
          Nhập thông tin khách và tour, hệ thống tự tính giá theo bảng giá hiện hành.
        </DialogDescription>

        {done ? (
          <div className="mt-4 rounded-xl border border-state-success/30 bg-state-success/5 p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-state-success" />
            <p className="mt-2 text-[14px] font-semibold text-ink">Đơn {done.booking_code} đã được tạo</p>
            <p className="mt-1 text-[12.5px] text-slate-500">Tổng tiền {formatVND(done.total_price)}</p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-4 h-9 rounded-lg bg-brand px-4 text-[13px] font-semibold text-white"
            >
              Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-3 space-y-3">
            <div>
              <label className="mb-1 block text-[11.5px] font-medium text-slate-500">Tour</label>
              <select value={form.tour_id} onChange={update("tour_id")} className={inputClass}>
                <option value="">Chọn tour…</option>
                {tours.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11.5px] font-medium text-slate-500">Ngày khởi hành</label>
                <input type="date" value={form.departure_date} onChange={update("departure_date")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-[11.5px] font-medium text-slate-500">Kênh bán</label>
                <select value={form.channel} onChange={update("channel")} className={inputClass}>
                  {["Website", "Facebook", "Zalo", "Hotline", "Đại lý", "Walk-in"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11.5px] font-medium text-slate-500">Họ tên khách</label>
                <input value={form.customer_name} onChange={update("customer_name")} placeholder="Nguyễn Văn A" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-[11.5px] font-medium text-slate-500">Số điện thoại</label>
                <input value={form.customer_phone} onChange={update("customer_phone")} placeholder="09xx xxx xxx" className={inputClass} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[11.5px] font-medium text-slate-500">Người lớn</label>
                <input type="number" min="1" value={form.adults_count} onChange={update("adults_count")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-[11.5px] font-medium text-slate-500">Trẻ em</label>
                <input type="number" min="0" value={form.children_count} onChange={update("children_count")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-[11.5px] font-medium text-slate-500">Nhân viên sale</label>
                <input value={form.sale_owner} onChange={update("sale_owner")} placeholder="Tên sale" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11.5px] font-medium text-slate-500">Ghi chú / yêu cầu</label>
              <textarea
                value={form.note}
                onChange={update("note")}
                rows={2}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[13px] outline-none focus:border-brand"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
              <span className="text-[12px] text-slate-500">
                {tour ? `Giá từ ${formatVND(finalPrice(tour))} / khách` : "Chọn tour để xem giá"}
              </span>
              <span className="text-[14px] font-semibold text-ink tnum">{formatVND(estimate)}</span>
            </div>

            {error && <p className="rounded-lg bg-state-danger/10 px-3 py-2 text-[12px] font-medium text-state-danger">{error}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-9 rounded-lg border border-slate-200 px-3.5 text-[13px] font-medium text-slate-600"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-[13px] font-semibold text-white disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Tạo đơn
              </button>
            </div>
            <p className="text-[11px] text-slate-400">Đơn tạo hôm nay: {formatDateVN(new Date())}</p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}