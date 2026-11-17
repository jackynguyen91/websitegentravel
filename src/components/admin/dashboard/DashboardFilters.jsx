import { useNavigate } from "@tanstack/react-router";
import { RANGE_OPTIONS } from "@/lib/admin/nav";

const selectClass =
  "h-8 rounded-lg border border-slate-200 bg-white px-2 text-[12px] font-medium text-slate-600 outline-none focus:border-brand";

export default function DashboardFilters({ search, options }) {
  const navigate = useNavigate();
  const setParam = (key, value) => {
    navigate({
      to: "/admin",
      search: (prev) => ({ ...prev, [key]: value || undefined }),
      replace: true,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/80 bg-admin-card px-3 py-2.5 shadow-sm">
      <div className="flex flex-wrap items-center gap-1">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setParam("range", option.value)}
            className={`h-7 rounded-md px-2.5 text-[11.5px] font-medium transition ${
              (search.range || "30d") === option.value
                ? "bg-brand text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {(search.range || "30d") === "custom" && (
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={search.from || ""}
            onChange={(event) => setParam("from", event.target.value)}
            className="h-8 rounded-lg border border-slate-200 px-2 text-[12px]"
          />
          <span className="text-[11px] text-slate-400">→</span>
          <input
            type="date"
            value={search.to || ""}
            onChange={(event) => setParam("to", event.target.value)}
            className="h-8 rounded-lg border border-slate-200 px-2 text-[12px]"
          />
        </div>
      )}

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <select value={search.scope || "all"} onChange={(event) => setParam("scope", event.target.value)} className={selectClass}>
          <option value="all">Mọi loại tour</option>
          <option value="domestic">Nội địa</option>
          <option value="international">Quốc tế</option>
        </select>
        <select
          value={search.destination || "all"}
          onChange={(event) => setParam("destination", event.target.value)}
          className={selectClass}
        >
          <option value="all">Mọi điểm đến</option>
          {options.destinations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select value={search.channel || "all"} onChange={(event) => setParam("channel", event.target.value)} className={selectClass}>
          <option value="all">Mọi kênh bán</option>
          {options.channels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select value={search.sale || "all"} onChange={(event) => setParam("sale", event.target.value)} className={selectClass}>
          <option value="all">Mọi nhân viên</option>
          {options.sales.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setParam("compare", search.compare === "yoy" ? undefined : "yoy")}
          className={`h-8 rounded-lg border px-2.5 text-[11.5px] font-medium transition ${
            search.compare === "yoy"
              ? "border-brand bg-brand-50 text-brand"
              : "border-slate-200 bg-white text-slate-500 hover:text-ink"
          }`}
        >
          So cùng kỳ năm trước
        </button>
      </div>
    </div>
  );
}