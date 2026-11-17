import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactVND, formatVND } from "@/lib/format";

export default function DestinationChart({ destinations }) {
  const data = destinations.map((item) => ({
    ...item,
    shortName: item.name.length > 16 ? `${item.name.slice(0, 15)}…` : item.name,
  }));

  return (
    <div className="h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 6, right: 4, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="shortName"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#94A3B8" }}
            interval={0}
            angle={-18}
            textAnchor="end"
            height={44}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10.5, fill: "#94A3B8" }}
            tickFormatter={(value) => formatCompactVND(value)}
            width={56}
          />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
            formatter={(value) => [formatVND(value), "Doanh thu"]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={34}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={index < 3 ? "#0F766E" : "#94C7C1"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}