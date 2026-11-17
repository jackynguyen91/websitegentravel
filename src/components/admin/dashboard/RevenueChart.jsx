import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactVND, formatVND } from "@/lib/format";

const UNITS = [
  { key: "day", label: "Ngày" },
  { key: "week", label: "Tuần" },
  { key: "month", label: "Tháng" },
  { key: "quarter", label: "Quý" },
];

export default function RevenueChart({ series }) {
  const firstAvailable = UNITS.find((unit) => series[unit.key]?.length) || UNITS[2];
  const [unit, setUnit] = useState(firstAvailable.key);
  const data = series[unit]?.length ? series[unit] : series[firstAvailable.key] || [];

  return (
    <div>
      <div className="mb-2 flex items-center justify-end gap-1">
        {UNITS.map((item) => (
          <button
            key={item.key}
            type="button"
            disabled={!series[item.key]?.length}
            onClick={() => setUnit(item.key)}
            className={`rounded-md px-2 py-1 text-[11px] font-medium transition disabled:opacity-40 ${
              unit === item.key ? "bg-brand text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="h-[268px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 6, right: 4, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10.5, fill: "#94A3B8" }}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="money"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10.5, fill: "#94A3B8" }}
              tickFormatter={(value) => formatCompactVND(value)}
              width={62}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10.5, fill: "#94A3B8" }}
              width={28}
            />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
              formatter={(value, name) =>
                name === "Số đơn" ? [`${value} đơn`, name] : [formatVND(value), name]
              }
            />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={7} />
            <Bar yAxisId="money" dataKey="revenue" name="Doanh thu" fill="#0F766E" radius={[4, 4, 0, 0]} maxBarSize={34} />
            <Line
              yAxisId="money"
              type="monotone"
              dataKey="prevRevenue"
              name="Kỳ trước"
              stroke="#94A3B8"
              strokeDasharray="4 3"
              strokeWidth={1.6}
              dot={false}
            />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              name="Số đơn"
              stroke="#F97316"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}