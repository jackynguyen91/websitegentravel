import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { field, labelText, area } from "@/components/admin/tours/form-parts";

const MANUAL_STATUSES = ["Đã khởi hành", "Đã hủy"];

export default function DepartureEditorDialog({ open, onOpenChange, departure, date, tours, onSaved }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(departure?.id);

  useEffect(() => {
    if (!open) return;
    setError("");
    if (departure) {
      setForm({ ...departure, tour_id: departure.tour_id });
    } else {
      const tour = tours[0];
      setForm({
        tour_id: tour?.id || "",
        departure_date: date,
        seats_total: Number(tour?.seats_total) || 20,
        seats_held: 0,
        guide_name: "",
        guide_phone: "",
        vehicle: "",
        note: "",
        status: "Mở bán",
      });
    }
  }, [open, departure, date, tours]);

  if (!form) return null;

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    const tour = tours.find((item) => item.id === form.tour_id);
    if (!tour) {
      setError("Vui lòng chọn tour cho chuyến khởi hành.");
      return;
    }
    if (!form.departure_date) {
      setError("Vui lòng chọn ngày khởi hành.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        tour_id: tour.id,
        tour_title: tour.title,
        departure_date: form.departure_date,
        seats_total: Number(form.seats_total) || 0,
        seats_held: Number(form.seats_held) || 0,
        guide_name: (form.guide_name || "").trim(),
        guide_phone: (form.guide_phone || "").trim(),
        vehicle: (form.vehicle || "").trim(),
        note: (form.note || "").trim(),
        status: MANUAL_STATUSES.includes(form.status) ? form.status : "Mở bán",
      };
      if (isEdit) await base44.entities.Departure.update(departure.id, payload);
      else await base44.entities.Departure.create(payload);
      onSaved();
      onOpenChange(false);
    } catch {
      setError("Chưa lưu được chuyến khởi hành.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    await base44.entities.Departure.delete(departure.id);
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-xl overflow-y-auto">
        <DialogTitle className="font-heading text-lg font-extrabold text-ink">
          {isEdit ? "Sửa chuyến khởi hành" : "Thêm chuyến khởi hành"}
        </DialogTitle>
        <DialogDescription className="text-[12.5px] text-slate-500">
          Số chỗ còn lại tự tính từ tổng chỗ trừ chỗ đã bán và đang giữ. Chuyến tự đóng bán khi hết chỗ.
        </DialogDescription>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelText}>Tour</label>
            <select className={field} value={form.tour_id} onChange={(e) => set("tour_id", e.target.value)}>
              {tours.map((tour) => (
                <option key={tour.id} value={tour.id}>
                  {tour.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelText}>Ngày khởi hành</label>
            <input type="date" className={field} value={form.departure_date} onChange={(e) => set("departure_date", e.target.value)} />
          </div>
          <div>
            <label className={labelText}>Tổng số chỗ</label>
            <input type="number" min={1} className={field} value={form.seats_total} onChange={(e) => set("seats_total", e.target.value)} />
          </div>
          <div>
            <label className={labelText}>Chỗ đang giữ</label>
            <input type="number" min={0} className={field} value={form.seats_held} onChange={(e) => set("seats_held", e.target.value)} />
          </div>
          <div>
            <label className={labelText}>Trạng thái</label>
            <select className={field} value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="Mở bán">Tự động (theo số chỗ)</option>
              {MANUAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelText}>Hướng dẫn viên</label>
            <input className={field} value={form.guide_name} onChange={(e) => set("guide_name", e.target.value)} placeholder="Nguyễn Thu Hà" />
          </div>
          <div>
            <label className={labelText}>SĐT HDV</label>
            <input className={field} value={form.guide_phone} onChange={(e) => set("guide_phone", e.target.value)} placeholder="09xx xxx xxx" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelText}>Xe / nhà xe</label>
            <input className={field} value={form.vehicle} onChange={(e) => set("vehicle", e.target.value)} placeholder="Xe 29 chỗ – Nhà xe Hải Vân" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelText}>Ghi chú điều hành</label>
            <textarea rows={2} className={area} value={form.note} onChange={(e) => set("note", e.target.value)} />
          </div>
        </div>

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">{error}</p>}

        <div className="mt-5 flex items-center justify-between gap-2">
          {isEdit ? (
            <button type="button" onClick={handleDelete} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-red-200 px-3 text-[13px] font-semibold text-red-600">
              <Trash2 className="h-3.5 w-3.5" /> Xóa chuyến
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button type="button" onClick={() => onOpenChange(false)} className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600">
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-[13px] font-semibold text-white disabled:opacity-70"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEdit ? "Lưu thay đổi" : "Tạo chuyến"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}