import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatCompactVND, formatVND } from "@/lib/format";

function Value({ kpi }) {
  if (kpi.format === "percent") return <>{Number(kpi.value).toFixed(1).replace(".", ",")}%</>;
  if (kpi.format === "number") return <>{Number(kpi.value).toLocaleString("vi-VN")}</>;
  return <>{formatVND(kpi.value)}</>;
}

export default function KpiCard({ kpi, invert = false }) {
  const delta = Number(kpi.delta) || 0;
  const up = delta > 0.05;
  const down = delta < -0.05;
  const good = invert ? down : up;
  const bad = invert ? up : down;
  const spark = (kpi.spark || []).map((value, index) => ({ index, value }));

  return (
    <div className="rounded-xl border border-slate-200/80 bg-admin-card p-3.5 shadow-sm transition hover:border-slate-300/80">
      <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-500">{kpi.label}</p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <p className="text-[19px] font-bold leading-tight text-ink tnum">
          <Value kpi={kpi} />
        </p>
        <span
          className={`mb-1 inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tnum ${
            good
              ? "bg-state-success/10 text-state-success"
              : bad
                ? "bg-state-danger/10 text-state-danger"
                : "bg-slate-100 text-slate-500"
          }`}
        >
          {up ? <ArrowUpRight className="h-3 w-3" /> : down ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          {Math.abs(delta).toFixed(1).replace(".", ",")}%
        </span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-[10.5px] text-slate-400">so với kỳ trước</p>
        {spark.length > 1 && (
          <div className="h-7 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`spark-${kpi.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={bad ? "#DC2626" : "#0F766E"} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={bad ? "#DC2626" : "#0F766E"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={bad ? "#DC2626" : "#0F766E"}
                  strokeWidth={1.5}
                  fill={`url(#spark-${kpi.key})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {kpi.key === "revenue" && (
        <p className="mt-1 text-[10.5px] text-slate-400 tnum">{formatCompactVND(kpi.value)}</p>
      )}
    </div>
  );
}