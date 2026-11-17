import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { fromLines, slugify, toLines } from "@/lib/slugify";

const REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam", "Quốc tế"];
const CATEGORIES = ["Tour trong nước", "Tour quốc tế", "Nghỉ dưỡng", "Khám phá"];

const field =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-ink outline-none transition focus:border-brand";
const labelText = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500";
const area = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] leading-relaxed text-ink outline-none focus:border-brand";

const emptyForm = () => ({
  title: "",
  slug: "",
  destination: "",
  region: "Miền Bắc",
  scope: "domestic",
  category: "Tour trong nước",
  duration_days: 3,
  duration_nights: 2,
  price_adult: 0,
  price_child: 0,
  discount_percent: 0,
  departure_point: "Hà Nội",
  cover_image: "",
  is_featured: false,
  rating: 4.8,
  review_count: 0,
  route: [{ day: 1, title: "", description: "" }],
});

const emptyText = () => ({ gallery: "", itinerary: "", highlights: "", included: "", excluded: "", suitable: "" });

export default function TourFormDialog({ open, onOpenChange, tour, onSaved }) {
  const [form, setForm] = useState(emptyForm());
  const [text, setText] = useState(emptyText());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (tour) {
      setForm({
        ...emptyForm(),
        ...tour,
        route: tour.route?.length ? tour.route : [{ day: 1, title: "", description: "" }],
      });
      setText({
        gallery: toLines(tour.gallery_images),
        itinerary: toLines(tour.itinerary_images),
        highlights: toLines(tour.highlights),
        included: toLines(tour.included_services),
        excluded: toLines(tour.excluded_services),
        suitable: toLines(tour.suitable_for),
      });
    } else {
      setForm(emptyForm());
      setText(emptyText());
    }
  }, [open, tour]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const setRouteDay = (index, key, value) =>
    setForm((prev) => ({
      ...prev,
      route: prev.route.map((day, i) => (i === index ? { ...day, [key]: value } : day)),
    }));

  const addDay = () =>
    setForm((prev) => ({
      ...prev,
      route: [...prev.route, { day: prev.route.length + 1, title: "", description: "" }],
    }));

  const removeDay = (index) =>
    setForm((prev) => ({ ...prev, route: prev.route.filter((_, i) => i !== index) }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.destination.trim()) {
      setError("Vui lòng nhập tên tour và điểm đến.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        destination: form.destination.trim(),
        region: form.region,
        scope: form.scope,
        category: form.category,
        duration_days: Number(form.duration_days) || 1,
        duration_nights: Number(form.duration_nights) || 0,
        price_adult: Number(form.price_adult) || 0,
        price_child: Number(form.price_child) || 0,
        discount_percent: Number(form.discount_percent) || 0,
        departure_point: form.departure_point.trim(),
        cover_image: form.cover_image.trim(),
        gallery_images: fromLines(text.gallery),
        itinerary_images: fromLines(text.itinerary).slice(0, 6),
        highlights: fromLines(text.highlights),
        route: form.route
          .filter((day) => day.title.trim())
          .map((day, index) => ({
            day: index + 1,
            title: day.title.trim(),
            description: day.description.trim(),
            image: (day.image || "").trim(),
          })),
        included_services: fromLines(text.included),
        excluded_services: fromLines(text.excluded),
        suitable_for: fromLines(text.suitable),
        is_featured: Boolean(form.is_featured),
        rating: Number(form.rating) || 4.8,
        review_count: Number(form.review_count) || 0,
      };

      if (tour) {
        await base44.entities.Tour.update(tour.id, payload);
      } else {
        await base44.entities.Tour.create(payload);
      }
      onSaved();
      onOpenChange(false);
    } catch {
      setError("Chưa lưu được tour. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
        <DialogTitle className="font-heading text-lg font-extrabold text-ink">
          {tour ? "Chỉnh sửa tour" : "Thêm tour mới"}
        </DialogTitle>
        <DialogDescription className="text-[12.5px] text-slate-500">
          Điền thông tin tour, lịch trình từng ngày và các dịch vụ bao gồm.
        </DialogDescription>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelText}>Tên tour</label>
            <input className={field} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Phú Quốc – Thiên Đường Nắng Vàng" />
          </div>

          <div>
            <label className={labelText}>Đường dẫn (slug)</label>
            <input className={field} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="de trong de tu tao" />
          </div>
          <div>
            <label className={labelText}>Điểm đến</label>
            <input className={field} value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="Phú Quốc" />
          </div>

          <div>
            <label className={labelText}>Vùng miền</label>
            <select className={field} value={form.region} onChange={(e) => set("region", e.target.value)}>
              {REGIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelText}>Danh mục</label>
            <select className={field} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelText}>Phạm vi</label>
            <select className={field} value={form.scope} onChange={(e) => set("scope", e.target.value)}>
              <option value="domestic">Trong nước</option>
              <option value="international">Quốc tế</option>
            </select>
          </div>
          <div>
            <label className={labelText}>Điểm khởi hành</label>
            <input className={field} value={form.departure_point} onChange={(e) => set("departure_point", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelText}>Số ngày</label>
              <input type="number" min={1} className={field} value={form.duration_days} onChange={(e) => set("duration_days", e.target.value)} />
            </div>
            <div>
              <label className={labelText}>Số đêm</label>
              <input type="number" min={0} className={field} value={form.duration_nights} onChange={(e) => set("duration_nights", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelText}>Giá NL</label>
              <input type="number" min={0} className={field} value={form.price_adult} onChange={(e) => set("price_adult", e.target.value)} />
            </div>
            <div>
              <label className={labelText}>Giá TE</label>
              <input type="number" min={0} className={field} value={form.price_child} onChange={(e) => set("price_child", e.target.value)} />
            </div>
            <div>
              <label className={labelText}>Giảm %</label>
              <input type="number" min={0} max={90} className={field} value={form.discount_percent} onChange={(e) => set("discount_percent", e.target.value)} />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={labelText}>Ảnh đại diện (URL)</label>
            <input className={field} value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} placeholder="https://…" />
          </div>

          <div className="sm:col-span-2">
            <label className={labelText}>Thư viện ảnh (mỗi dòng một URL)</label>
            <textarea rows={3} className={area} value={text.gallery} onChange={(e) => setText((p) => ({ ...p, gallery: e.target.value }))} />
          </div>

          <div className="sm:col-span-2">
            <label className={labelText}>Ảnh điểm đến trong lịch trình (mỗi dòng một URL, tối đa 6 ảnh)</label>
            <textarea rows={4} className={area} value={text.itinerary} onChange={(e) => setText((p) => ({ ...p, itinerary: e.target.value }))} />
          </div>

          <div>
            <label className={labelText}>Điểm nổi bật (mỗi dòng một ý)</label>
            <textarea rows={4} className={area} value={text.highlights} onChange={(e) => setText((p) => ({ ...p, highlights: e.target.value }))} />
          </div>
          <div>
            <label className={labelText}>Phù hợp với (mỗi dòng một nhóm)</label>
            <textarea rows={4} className={area} value={text.suitable} onChange={(e) => setText((p) => ({ ...p, suitable: e.target.value }))} />
          </div>

          <div>
            <label className={labelText}>Dịch vụ bao gồm</label>
            <textarea rows={4} className={area} value={text.included} onChange={(e) => setText((p) => ({ ...p, included: e.target.value }))} />
          </div>
          <div>
            <label className={labelText}>Không bao gồm</label>
            <textarea rows={4} className={area} value={text.excluded} onChange={(e) => setText((p) => ({ ...p, excluded: e.target.value }))} />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <label className={labelText}>Lịch trình từng ngày</label>
              <button
                type="button"
                onClick={addDay}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand"
              >
                <Plus className="h-3.5 w-3.5" /> Thêm ngày
              </button>
            </div>
            <div className="space-y-2">
              {form.route.map((day, index) => (
                <div key={index} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-[11px] font-bold text-brand">
                      N{index + 1}
                    </span>
                    <input
                      className={field}
                      placeholder="Tiêu đề ngày"
                      value={day.title}
                      onChange={(e) => setRouteDay(index, "title", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeDay(index)}
                      aria-label="Xóa ngày"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    className={`${area} mt-2`}
                    placeholder="Mô tả hoạt động trong ngày"
                    value={day.description}
                    onChange={(e) => setRouteDay(index, "description", e.target.value)}
                  />
                  <input
                    className={`${field} mt-2`}
                    placeholder="Ảnh địa điểm trong ngày (URL)"
                    value={day.image || ""}
                    onChange={(e) => setRouteDay(index, "image", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(form.is_featured)}
                onChange={(e) => set("is_featured", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              Tour nổi bật
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelText}>Điểm đánh giá</label>
              <input type="number" step="0.1" min={0} max={5} className={field} value={form.rating} onChange={(e) => set("rating", e.target.value)} />
            </div>
            <div>
              <label className={labelText}>Số đánh giá</label>
              <input type="number" min={0} className={field} value={form.review_count} onChange={(e) => set("review_count", e.target.value)} />
            </div>
          </div>
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
            {tour ? "Lưu thay đổi" : "Tạo tour"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}