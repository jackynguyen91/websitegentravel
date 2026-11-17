import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { area, field, labelText } from "@/components/admin/tours/form-parts";

export const PARTNER_TYPES = ["Khách sạn", "Nhà xe", "Nhà hàng", "Hướng dẫn viên", "Hãng bay", "Khác"];
const STATUSES = ["Đang hợp tác", "Tạm dừng", "Ngừng hợp tác"];

const empty = () => ({
  name: "",
  type: "Khách sạn",
  contact_person: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  rating: 5,
  status: "Đang hợp tác",
  note: "",
});

export default function PartnerDialog({ open, onOpenChange, partner, onSaved }) {
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(partner?.id);

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm(partner ? { ...empty(), ...partner } : empty());
  }, [open, partner]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Vui lòng nhập tên đối tác.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        contact_person: form.contact_person.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        rating: Number(form.rating) || 5,
        status: form.status,
        note: form.note.trim(),
      };
      if (isEdit) await base44.entities.Partner.update(partner.id, payload);
      else await base44.entities.Partner.create(payload);
      onSaved();
      onOpenChange(false);
    } catch {
      setError("Chưa lưu được đối tác.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-xl overflow-y-auto">
        <DialogTitle className="font-heading text-lg font-extrabold text-ink">{isEdit ? "Sửa đối tác" : "Thêm đối tác"}</DialogTitle>
        <DialogDescription className="text-[12.5px] text-slate-500">
          Hồ sơ khách sạn, nhà xe, nhà hàng, hướng dẫn viên dùng để ghi nhận chi phí từng tour.
        </DialogDescription>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelText}>Tên đối tác</label>
            <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Khách sạn Mường Thanh Luxury" />
          </div>
          <div>
            <label className={labelText}>Loại dịch vụ</label>
            <select className={field} value={form.type} onChange={(e) => set("type", e.target.value)}>
              {PARTNER_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelText}>Trạng thái</label>
            <select className={field} value={form.status} onChange={(e) => set("status", e.target.value)}>
              {STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelText}>Người liên hệ</label>
            <input className={field} value={form.contact_person} onChange={(e) => set("contact_person", e.target.value)} />
          </div>
          <div>
            <label className={labelText}>Điện thoại</label>
            <input className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className={labelText}>Email</label>
            <input className={field} value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className={labelText}>Tỉnh / Thành phố</label>
            <input className={field} value={form.city} onChange={(e) => set("city", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelText}>Địa chỉ</label>
            <input className={field} value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div>
            <label className={labelText}>Đánh giá (1-5)</label>
            <input type="number" min={1} max={5} step={0.5} className={field} value={form.rating} onChange={(e) => set("rating", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelText}>Ghi chú hợp đồng</label>
            <textarea rows={3} className={area} value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Điều khoản thanh toán, giá nhập, thời gian giữ phòng…" />
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
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isEdit ? "Lưu thay đổi" : "Thêm đối tác"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}