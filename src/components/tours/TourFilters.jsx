import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatCompactVND } from "@/lib/format";

const CATEGORIES = ["Tour trong nước", "Tour quốc tế", "Nghỉ dưỡng", "Khám phá"];
const DURATIONS = [
  { label: "1 – 3 ngày", value: "1-3" },
  { label: "4 – 5 ngày", value: "4-5" },
  { label: "Trên 5 ngày", value: "6" },
];

const MAX_PRICE = 40000000;

function Group({ title, children }) {
  return (
    <div className="border-b border-slate-100 py-5 first:pt-0 last:border-0 last:pb-0">
      <h3 className="font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-ink">{title}</h3>
      <div className="mt-3.5">{children}</div>
    </div>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition ${
        active
          ? "border-brand bg-brand text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

export default function TourFilters({ search, destinations = [], onChange, onReset }) {
  const [price, setPrice] = useState(search.max_price || MAX_PRICE);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-ink">Bộ lọc tour</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-500 transition hover:text-brand"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Đặt lại
        </button>
      </div>

      <Group title="Danh mục">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              active={search.category === category}
              onClick={() => onChange({ category: search.category === category ? undefined : category })}
            >
              {category}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Điểm đến">
        <select
          value={search.destination || ""}
          onChange={(event) => onChange({ destination: event.target.value || undefined })}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand"
        >
          <option value="">Tất cả điểm đến</option>
          {destinations.map((destination) => (
            <option key={destination} value={destination}>
              {destination}
            </option>
          ))}
        </select>
      </Group>

      <Group title="Ngân sách tối đa">
        <div className="flex items-baseline justify-between">
          <span className="font-heading text-[15px] font-bold text-brand">{formatCompactVND(price)}</span>
          <span className="text-[11px] text-slate-400">/khách</span>
        </div>
        <Slider
          className="mt-3"
          min={2000000}
          max={MAX_PRICE}
          step={500000}
          value={[price]}
          onValueChange={([value]) => setPrice(value)}
          onValueCommit={([value]) => onChange({ max_price: value >= MAX_PRICE ? undefined : value })}
        />
        <div className="mt-1.5 flex justify-between text-[10.5px] text-slate-400">
          <span>2 triệu</span>
          <span>40 triệu</span>
        </div>
      </Group>

      <Group title="Thời lượng">
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((item) => (
            <Chip
              key={item.value}
              active={search.duration === item.value}
              onClick={() => onChange({ duration: search.duration === item.value ? undefined : item.value })}
            >
              {item.label}
            </Chip>
          ))}
        </div>
      </Group>
    </div>
  );
}