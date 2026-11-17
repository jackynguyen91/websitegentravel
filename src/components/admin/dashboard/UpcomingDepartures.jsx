import { CalendarRange } from "lucide-react";
import { formatDateVN } from "@/lib/format";

export default function UpcomingDepartures({ departures }) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-admin-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-[13.5px] font-semibold text-ink">Lịch khởi hành sắp tới</h2>
        <span className="text-[10.5px] text-slate-400">7 ngày tới</span>
      </div>

      {departures.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 py-8 text-center">
          <CalendarRange className="h-6 w-6 text-slate-300" />
          <p className="text-[12px] text-slate-400">Chưa có lịch khởi hành trong 7 ngày tới</p>
        </div>
      ) : (
        <div className="mt-2 divide-y divide-slate-100">
          {departures.map((dep) => {
            const fill = dep.total ? Math.round((dep.booked / dep.total) * 100) : 0;
            return (
              <div key={dep.id} className="py-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">{dep.tour}</p>
                  <span className="shrink-0 text-[11px] text-slate-500">{formatDateVN(dep.date)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${fill >= 90 ? "bg-state-danger" : fill >= 60 ? "bg-brand" : "bg-state-warning"}`}
                      style={{ width: `${Math.min(fill, 100)}%` }}
                    />
                  </div>
                  <span className="w-[64px] shrink-0 text-right text-[10.5px] text-slate-500 tnum">
                    {dep.booked}/{dep.total} chỗ
                  </span>
                </div>
                <p className="mt-1 text-[10.5px] text-slate-400">
                  HDV: {dep.guide || "Chưa phân công"} · Lấp đầy {fill}%
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}