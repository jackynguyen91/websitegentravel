import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { fromLines, slugify, toLines } from "@/lib/slugify";

const TYPES = ["Vé máy bay", "Vé tham quan", "Khách sạn", "Visa"];

const field =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-ink outline-none transition focus:border-brand";
const labelText = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500";
const area = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] leading-relaxed text-ink outline-none focus:border-brand";

const emptyForm = () => ({
  title: "",
  slug: "",
  type: "Vé máy bay",
  summary: "",
  image: "",
  price_from: 0,
  price_unit: "vé",
  price_note: "",
  is_active: true,
});

export default function ServiceFormDialog({ open, onOpenChange, service, onSaved }) {
  const [form, setForm] = useState(emptyForm());
  const [highlights, setHighlights] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm(service ? { ...emptyForm(), ...service } : emptyForm());
    setHighlights(toLines(service?.highlights));
  }, [open, service]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Vui lòng nhập tên dịch vụ.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        type: form.type,
        summary: form.summary.trim(),
        image: form.image.trim(),
        price_from: Number(form.price_from) || 0,
        price_unit: form.price_unit.trim(),
        price_note: form.price_note.trim(),
        highlights: fromLines(highlights),
        is_active: Boolean(form.is_active),
      };

      if (service) {
        await base44.entities.Service.update(service.id, payload);
      } else {
        await base44.entities.Service.create(payload);
      }
      onSaved();
      onOpenChange(false);
    } catch {
      setError("Chưa lưu được dịch vụ. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogTitle className="font-heading text-lg font-extrabold text-ink">
          {service ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        </DialogTitle>
        <DialogDescription className="text-[12.5px] text-slate-500">
          Dịch vụ hiển thị trong mục Dịch vụ khác trên website.
        </DialogDescription>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelText}>Tên dịch vụ</label>
            <input
              className={field}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Vé máy bay nội địa – Vietnam Airlines & Vietjet"
            />
          </div>

          <div>
            <label className={labelText}>Đường dẫn (slug)</label>
            <input className={field} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="de trong de tu tao" />
          </div>
          <div>
            <label className={labelText}>Loại dịch vụ</label>
            <select className={field} value={form.type} onChange={(e) => set("type", e.target.value)}>
              {TYPES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={labelText}>Ảnh đại diện (URL)</label>
            <input className={field} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" />
          </div>

          <div className="sm:col-span-2">
            <label className={labelText}>Mô tả ngắn</label>
            <textarea rows={2} className={area} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>

          <div className="sm:col-span-2">
            <label className={labelText}>Điểm nổi bật (mỗi dòng một ý)</label>
            <textarea rows={3} className={area} value={highlights} onChange={(e) => setHighlights(e.target.value)} />
          </div>

          <div>
            <label className={labelText}>Giá từ (VND)</label>
            <input
              type="number"
              min={0}
              className={field}
              value={form.price_from}
              onChange={(e) => set("price_from", e.target.value)}
            />
          </div>
          <div>
            <label className={labelText}>Đơn vị giá</label>
            <input className={field} value={form.price_unit} onChange={(e) => set("price_unit", e.target.value)} placeholder="vé / đêm / hồ sơ" />
          </div>

          <div className="sm:col-span-2">
            <label className={labelText}>Ghi chú giá</label>
            <input
              className={field}
              value={form.price_note}
              onChange={(e) => set("price_note", e.target.value)}
              placeholder="Giá tham khảo, báo giá theo ngày khởi hành"
            />
          </div>

          <label className="flex items-center gap-2 text-[13px] font-medium text-slate-600 sm:col-span-2">
            <input
              type="checkbox"
              checked={Boolean(form.is_active)}
              onChange={(e) => set("is_active", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            Đang hiển thị trên website
          </label>
        </div>

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-[13px] font-semibold text-white disabled:opacity-70"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {service ? "Lưu thay đổi" : "Tạo dịch vụ"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}