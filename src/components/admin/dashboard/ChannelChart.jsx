import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactVND, formatVND } from "@/lib/format";

const COLORS = ["#0F766E", "#14B8A6", "#38BDF8", "#F59E0B", "#8B5CF6", "#94A3B8"];

export default function ChannelChart({ channels }) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={channels} margin={{ top: 6, right: 4, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10.5, fill: "#94A3B8" }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10.5, fill: "#94A3B8" }}
            tickFormatter={(value) => formatCompactVND(value)}
            width={58}
          />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
            formatter={(value) => [formatVND(value), "Doanh thu"]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={38}>
            {channels.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}