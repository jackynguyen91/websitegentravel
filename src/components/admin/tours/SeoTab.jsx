import { Section, area, field, ghostButton } from "@/components/admin/tours/form-parts";

export default function SeoTab({ form, set, onGenerate }) {
  const titleLength = (form.seo_title || "").length;
  const descriptionLength = (form.seo_description || "").length;

  return (
    <div className="space-y-3">
      <Section title="Thẻ SEO" hint="Tiêu đề nên dài 50–60 ký tự, mô tả 140–160 ký tự để hiển thị đầy đủ trên Google.">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">SEO title</label>
              <span className={`text-[11px] tnum ${titleLength > 60 ? "text-red-600" : "text-slate-400"}`}>{titleLength}/60</span>
            </div>
            <input className={field} value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} placeholder={form.title || "Tiêu đề hiển thị trên Google"} />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">SEO description</label>
              <span className={`text-[11px] tnum ${descriptionLength > 160 ? "text-red-600" : "text-slate-400"}`}>{descriptionLength}/160</span>
            </div>
            <textarea rows={3} className={area} value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} placeholder="Mô tả ngắn gọn hấp dẫn về tour" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Từ khóa</label>
            <input className={field} value={form.seo_keywords} onChange={(e) => set("seo_keywords", e.target.value)} placeholder="tour phú quốc, tour 4 ngày 3 đêm" />
          </div>
          <button type="button" onClick={onGenerate} className={ghostButton}>
            Tạo tự động từ tên tour & điểm đến
          </button>
        </div>
      </Section>

      <Section title="Xem trước kết quả tìm kiếm">
        <div className="rounded-xl border border-slate-100 bg-cloud p-4">
          <p className="text-[12px] text-emerald-700">gientravel.vn › tours › {form.slug || "duong-dan-tour"}</p>
          <p className="mt-1 line-clamp-2 text-[16px] font-medium text-[#1a0dab]">{form.seo_title || form.title || "Tên tour của bạn"}</p>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-slate-600">
            {form.seo_description || `${form.title || "Tour"} – ${form.destination || "điểm đến"} với lịch trình chi tiết, giá minh bạch, hỗ trợ 24/7 từ GenTravel.`}
          </p>
        </div>
      </Section>
    </div>
  );
}