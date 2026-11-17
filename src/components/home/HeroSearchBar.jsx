import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Search, Wallet } from "lucide-react";

const PRICE_RANGES = [
  { label: "Mọi mức giá", value: "" },
  { label: "Dưới 5 triệu", value: "0-5000000" },
  { label: "5 – 10 triệu", value: "5000000-10000000" },
  { label: "10 – 20 triệu", value: "10000000-20000000" },
  { label: "Trên 20 triệu", value: "20000000-0" },
];

const fieldClass =
  "h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

export default function HeroSearchBar({ destinations = [] }) {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const [min, max] = price ? price.split("-").map(Number) : [];
    navigate({
      to: "/tours",
      search: {
        destination: destination || undefined,
        date: date || undefined,
        min_price: min ? min : undefined,
        max_price: max ? max : undefined,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-20 rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-soft backdrop-blur-xl sm:p-5"
      aria-label="Tìm kiếm tour"
    >
      <div className="grid gap-3 md:grid-cols-[1.1fr_1fr_1fr_auto] md:items-end">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-brand" /> Điểm đến
          </span>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className={fieldClass}>
              <option value="">Bạn muốn đi đâu?</option>
              {destinations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            <CalendarDays className="h-3.5 w-3.5 text-brand" /> Ngày khởi hành
          </span>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            <Wallet className="h-3.5 w-3.5 text-brand" /> Ngân sách
          </span>
          <div className="relative">
            <Wallet className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select value={price} onChange={(e) => setPrice(e.target.value)} className={fieldClass}>
              {PRICE_RANGES.map((range) => (
                <option key={range.label} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-7 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Search className="h-4 w-4" />
          Tìm tour
        </button>
      </div>
    </form>
  );
}