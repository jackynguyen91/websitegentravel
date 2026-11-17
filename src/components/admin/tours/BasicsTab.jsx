import { Labelled, Section, field } from "@/components/admin/tours/form-parts";
import { TOUR_STATUSES } from "@/lib/tour-status";
import { slugify } from "@/lib/slugify";

const REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam", "Quốc tế"];
const CATEGORIES = ["Tour trong nước", "Tour quốc tế", "Nghỉ dưỡng", "Khám phá"];

export default function BasicsTab({ form, set }) {
  return (
    <div className="space-y-3">
      <Section title="Thông tin chung">
        <div className="grid gap-3 sm:grid-cols-2">
          <Labelled label="Tên tour" span>
            <input className={field} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Phú Quốc – Thiên đường nắng vàng" />
          </Labelled>
          <Labelled label="Đường dẫn (slug)">
            <div className="flex gap-2">
              <input className={field} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="tu-dong-tao" />
              <button type="button" onClick={() => set("slug", slugify(form.title))} className="shrink-0 rounded-lg border border-slate-200 px-2 text-[11px] font-semibold text-slate-500 hover:text-brand">
                Tạo
              </button>
            </div>
          </Labelled>
          <Labelled label="Điểm đến">
            <input className={field} value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="Phú Quốc" />
          </Labelled>
          <Labelled label="Điểm khởi hành">
            <input className={field} value={form.departure_point} onChange={(e) => set("departure_point", e.target.value)} placeholder="Hà Nội" />
          </Labelled>
          <Labelled label="Vùng miền">
            <select className={field} value={form.region} onChange={(e) => set("region", e.target.value)}>
              {REGIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Labelled>
        </div>
      </Section>

      <Section title="Phân loại & trạng thái">
        <div className="grid gap-3 sm:grid-cols-2">
          <Labelled label="Danh mục">
            <select className={field} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Labelled>
          <Labelled label="Phạm vi">
            <select className={field} value={form.scope} onChange={(e) => set("scope", e.target.value)}>
              <option value="domestic">Trong nước</option>
              <option value="international">Quốc tế</option>
            </select>
          </Labelled>
          <Labelled label="Trạng thái bán">
            <select className={field} value={form.status} onChange={(e) => set("status", e.target.value)}>
              {TOUR_STATUSES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Labelled>
          <Labelled label="Thời lượng">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <input type="number" min={1} className={field} value={form.duration_days} onChange={(e) => set("duration_days", e.target.value)} />
                <span className="text-[11.5px] text-slate-500">ngày</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input type="number" min={0} className={field} value={form.duration_nights} onChange={(e) => set("duration_nights", e.target.value)} />
                <span className="text-[11.5px] text-slate-500">đêm</span>
              </div>
            </div>
          </Labelled>
          <Labelled label="Số chỗ mặc định mỗi chuyến">
            <input type="number" min={0} className={field} value={form.seats_total} onChange={(e) => set("seats_total", e.target.value)} />
          </Labelled>
          <label className="flex items-end gap-2 pb-2 text-[13px] font-medium text-slate-600">
            <input type="checkbox" checked={Boolean(form.is_featured)} onChange={(e) => set("is_featured", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" />
            Tour nổi bật trên trang chủ
          </label>
        </div>
      </Section>
    </div>
  );
}