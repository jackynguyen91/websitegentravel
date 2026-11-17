import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactVND, formatVND } from "@/lib/format";

export default function TopToursChart({ tours }) {
  const [metric, setMetric] = useState("revenue");
  const data = [...tours]
    .sort((a, b) => b[metric] - a[metric])
    .map((tour) => ({
      ...tour,
      shortName: tour.name.length > 30 ? `${tour.name.slice(0, 29)}…` : tour.name,
    }));

  return (
    <div>
      <div className="mb-2 flex items-center justify-end gap-1">
        {[
          { key: "revenue", label: "Doanh thu" },
          { key: "guests", label: "Số khách" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setMetric(item.key)}
            className={`rounded-md px-2 py-1 text-[11px] font-medium transition ${
              metric === item.key ? "bg-brand text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10.5, fill: "#94A3B8" }}
              tickFormatter={(value) => (metric === "revenue" ? formatCompactVND(value) : value)}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              width={150}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10.5, fill: "#475569" }}
            />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
              formatter={(value) => (metric === "revenue" ? [formatVND(value), "Doanh thu"] : [`${value} khách`, "Số khách"])}
            />
            <Bar dataKey={metric} radius={[0, 4, 4, 0]} maxBarSize={18}>
              {data.map((entry, index) => (
                <Cell key={entry.id} fill={index === 0 ? "#0F766E" : "#5EAAA3"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}