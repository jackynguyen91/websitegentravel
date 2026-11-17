import { Plus, Trash2 } from "lucide-react";
import { Section, area, field, ghostButton } from "@/components/admin/tours/form-parts";
import { fromLines, toLines } from "@/lib/slugify";
import { useState, useEffect } from "react";

export default function PolicyTab({ form, set }) {
  const [text, setText] = useState({ highlights: "", included: "", excluded: "", suitable: "" });

  useEffect(() => {
    setText({
      highlights: toLines(form.highlights),
      included: toLines(form.included_services),
      excluded: toLines(form.excluded_services),
      suitable: toLines(form.suitable_for),
    });
  }, [form.id]);

  const change = (key, value, target) => {
    setText((prev) => ({ ...prev, [key]: value }));
    set(target, fromLines(value));
  };

  const setPolicy = (index, key, value) =>
    set("cancellation_policy", form.cancellation_policy.map((row, i) => (i === index ? { ...row, [key]: value } : row)));

  return (
    <div className="space-y-3">
      <Section title="Điểm nổi bật & đối tượng">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Điểm nổi bật (mỗi dòng một ý)</label>
            <textarea rows={5} className={area} value={text.highlights} onChange={(e) => change("highlights", e.target.value, "highlights")} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Phù hợp với (mỗi dòng một nhóm)</label>
            <textarea rows={5} className={area} value={text.suitable} onChange={(e) => change("suitable", e.target.value, "suitable_for")} />
          </div>
        </div>
      </Section>

      <Section title="Bao gồm / không bao gồm">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700">Dịch vụ bao gồm</label>
            <textarea rows={6} className={area} value={text.included} onChange={(e) => change("included", e.target.value, "included_services")} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-red-600">Không bao gồm</label>
            <textarea rows={6} className={area} value={text.excluded} onChange={(e) => change("excluded", e.target.value, "excluded_services")} />
          </div>
        </div>
      </Section>

      <Section title="Chính sách hủy" hint="Mốc hủy trước bao nhiêu ngày thì thu bao nhiêu % giá tour.">
        <div className="space-y-2">
          {form.cancellation_policy.length === 0 && (
            <p className="rounded-lg bg-cloud px-3 py-3 text-[12.5px] text-slate-500">Chưa có mốc hủy nào.</p>
          )}
          {form.cancellation_policy.map((row, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[120px_120px_1fr_36px]">
              <div className="flex items-center gap-1.5">
                <input type="number" min={0} className={field} value={row.days_before} onChange={(e) => setPolicy(index, "days_before", e.target.value)} />
                <span className="text-[11.5px] text-slate-500">ngày</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input type="number" min={0} max={100} className={field} value={row.fee_percent} onChange={(e) => setPolicy(index, "fee_percent", e.target.value)} />
                <span className="text-[11.5px] text-slate-500">%</span>
              </div>
              <input className={field} placeholder="Ghi chú (VD: hoàn 100% nếu hủy trước 15 ngày)" value={row.note || ""} onChange={(e) => setPolicy(index, "note", e.target.value)} />
              <button
                type="button"
                aria-label="Xóa mốc hủy"
                onClick={() => set("cancellation_policy", form.cancellation_policy.filter((_, i) => i !== index))}
                className="grid h-10 w-9 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set("cancellation_policy", [...form.cancellation_policy, { days_before: 15, fee_percent: 0, note: "" }])}
          className={`${ghostButton} mt-2`}
        >
          <Plus className="h-3.5 w-3.5" /> Thêm mốc hủy
        </button>
      </Section>
    </div>
  );
}