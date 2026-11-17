import { Plus, Trash2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Section, area, field, ghostButton, labelText } from "@/components/admin/tours/form-parts";

export default function ItineraryTab({ form, set }) {
  const days = form.route;

  const setDay = (index, key, value) => set("route", days.map((day, i) => (i === index ? { ...day, [key]: value } : day)));
  const addDay = () => set("route", [...days, { day: days.length + 1, title: "", description: "", image: "" }]);
  const removeDay = (index) => set("route", days.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 })));

  return (
    <Section title="Lịch trình theo ngày" hint={`${days.length} ngày · mỗi ngày có tiêu đề, mô tả hoạt động và ảnh địa điểm.`}>
      <div className="space-y-3">
        {days.map((day, index) => (
          <div key={index} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-start gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-[11px] font-bold text-brand">N{index + 1}</span>
              <div className="min-w-0 flex-1 space-y-2">
                <input className={field} placeholder="Tiêu đề ngày (VD: Hà Nội – Vịnh Hạ Long)" value={day.title} onChange={(e) => setDay(index, "title", e.target.value)} />
                <textarea rows={2} className={area} placeholder="Hoạt động trong ngày, bữa ăn, khách sạn…" value={day.description} onChange={(e) => setDay(index, "description", e.target.value)} />
                <input className={field} placeholder="Ảnh địa điểm trong ngày (URL)" value={day.image || ""} onChange={(e) => setDay(index, "image", e.target.value)} />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-16 overflow-hidden rounded-lg bg-slate-100">
                  {day.image ? <Image src={day.image} alt={`Ngày ${index + 1}`} className="h-full w-full" fittingType="fill" /> : null}
                </div>
                <button
                  type="button"
                  aria-label="Xóa ngày"
                  onClick={() => removeDay(index)}
                  className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button type="button" onClick={addDay} className={ghostButton}>
          <Plus className="h-3.5 w-3.5" /> Thêm ngày
        </button>
        <div className="flex items-end gap-2">
          <div>
            <label className={labelText}>Tạo nhanh theo số ngày</label>
            <input
              type="number"
              min={1}
              max={30}
              className="h-9 w-20 rounded-lg border border-slate-200 px-2 text-[13px]"
              defaultValue={form.duration_days}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                const count = Math.max(Number(e.target.value) || 1, 1);
                set(
                  "route",
                  Array.from({ length: count }, (_, i) => days[i] || { day: i + 1, title: "", description: "", image: "" }),
                );
              }}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}