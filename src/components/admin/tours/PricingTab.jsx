import { Plus, Trash2 } from "lucide-react";
import { Labelled, Section, field, ghostButton, labelText } from "@/components/admin/tours/form-parts";
import { formatVND } from "@/lib/format";

const UNITS = ["Mỗi khách", "Mỗi trẻ em", "Toàn đoàn"];

const money = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-right text-[13px] font-semibold text-ink outline-none focus:border-brand tnum";

export default function PricingTab({ form, set }) {
  const setSurcharge = (index, key, value) =>
    set("surcharges", form.surcharges.map((row, i) => (i === index ? { ...row, [key]: value } : row)));

  const discount = Number(form.discount_percent) || 0;
  const adultFinal = discount > 0 ? Math.round((Number(form.price_adult) * (100 - discount)) / 100) : Number(form.price_adult) || 0;

  return (
    <div className="space-y-3">
      <Section title="Giá bán theo đối tượng" hint="Giá em bé thường chỉ tính phí dịch vụ, không có chỗ ngồi riêng.">
        <div className="grid gap-3 sm:grid-cols-3">
          <Labelled label="Người lớn">
            <input type="number" min={0} className={money} value={form.price_adult} onChange={(e) => set("price_adult", e.target.value)} />
          </Labelled>
          <Labelled label="Trẻ em">
            <input type="number" min={0} className={money} value={form.price_child} onChange={(e) => set("price_child", e.target.value)} />
          </Labelled>
          <Labelled label="Em bé">
            <input type="number" min={0} className={money} value={form.price_infant} onChange={(e) => set("price_infant", e.target.value)} />
          </Labelled>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Labelled label="Chi phí người lớn">
            <input type="number" min={0} className={money} value={form.cost_adult} onChange={(e) => set("cost_adult", e.target.value)} />
          </Labelled>
          <Labelled label="Chi phí trẻ em">
            <input type="number" min={0} className={money} value={form.cost_child} onChange={(e) => set("cost_child", e.target.value)} />
          </Labelled>
          <Labelled label="Chi phí em bé">
            <input type="number" min={0} className={money} value={form.cost_infant} onChange={(e) => set("cost_infant", e.target.value)} />
          </Labelled>
        </div>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="w-32">
            <label className={labelText}>Giảm giá (%)</label>
            <input type="number" min={0} max={90} className={field} value={form.discount_percent} onChange={(e) => set("discount_percent", e.target.value)} />
          </div>
          <div className="rounded-lg bg-brand-50 px-3 py-2 text-[12px] font-semibold text-brand">
            Giá người lớn sau giảm: <span className="tnum">{formatVND(adultFinal)}</span>
          </div>
        </div>
      </Section>

      <Section title="Phụ thu">
        <div className="space-y-2">
          {form.surcharges.length === 0 && (
            <p className="rounded-lg bg-cloud px-3 py-3 text-[12.5px] text-slate-500">Chưa có phụ thu. Ví dụ: phụ thu phòng đơn, phụ thu mùa cao điểm.</p>
          )}
          {form.surcharges.map((row, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_140px_130px_36px]">
              <input className={field} placeholder="Nội dung phụ thu" value={row.label} onChange={(e) => setSurcharge(index, "label", e.target.value)} />
              <input type="number" min={0} className={field} placeholder="Số tiền" value={row.amount} onChange={(e) => setSurcharge(index, "amount", e.target.value)} />
              <select className={field} value={row.unit} onChange={(e) => setSurcharge(index, "unit", e.target.value)}>
                {UNITS.map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </select>
              <button
                type="button"
                aria-label="Xóa phụ thu"
                onClick={() => set("surcharges", form.surcharges.filter((_, i) => i !== index))}
                className="grid h-10 w-9 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set("surcharges", [...form.surcharges, { label: "", amount: 0, unit: "Mỗi khách" }])}
          className={`${ghostButton} mt-2`}
        >
          <Plus className="h-3.5 w-3.5" /> Thêm phụ thu
        </button>
      </Section>
    </div>
  );
}