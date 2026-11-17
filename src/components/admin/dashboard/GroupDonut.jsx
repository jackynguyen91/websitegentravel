import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCompactVND, formatVND } from "@/lib/format";

const COLORS = ["#0F766E", "#38BDF8", "#F59E0B"];

export default function GroupDonut({ groups }) {
  const total = groups.reduce((sum, item) => sum + item.value, 0);
  const data = groups.filter((item) => item.value > 0);

  return (
    <div className="relative">
      <div className="h-[212px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={56}
              outerRadius={82}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
              formatter={(value) => [formatVND(value), "Doanh thu"]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={7} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[76px] text-center">
        <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">Tổng</p>
        <p className="text-[13px] font-bold text-ink tnum">{formatCompactVND(total)}</p>
      </div>
    </div>
  );
}