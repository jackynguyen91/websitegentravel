import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const TONE = {
  warning: "bg-state-warning",
  info: "bg-state-info",
  danger: "bg-state-danger",
  neutral: "bg-slate-400",
};

export default function AlertsPanel({ alerts }) {
  const total = alerts.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="rounded-xl border border-slate-200/80 bg-admin-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-[13.5px] font-semibold text-ink">Cần xử lý ngay</h2>
        <span className="rounded-full bg-state-danger/10 px-2 py-0.5 text-[10.5px] font-bold text-state-danger tnum">
          {total}
        </span>
      </div>
      <div className="mt-2 divide-y divide-slate-100">
        {alerts.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            className="flex items-center gap-2.5 py-2.5 transition hover:bg-slate-50/80"
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${TONE[item.tone] || TONE.neutral}`} />
            <span className="min-w-0 flex-1 text-[12px] leading-snug text-slate-600">{item.label}</span>
            <span className="text-[12.5px] font-bold text-ink tnum">{item.count}</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}