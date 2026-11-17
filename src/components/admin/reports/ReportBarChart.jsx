import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactVND, formatVND } from "@/lib/format";

export default function ReportBarChart({ data, color = "#0F766E", height = 240, label, valueKey = "revenue" }) {
  const rows = data.slice(0, 8).map((item) => ({ name: item.name, value: item[valueKey] || 0 }));
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
          <XAxis type="number" tickFormatter={(value) => formatCompactVND(value)} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={130}
            tick={{ fontSize: 10.5, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => (String(value).length > 22 ? `${String(value).slice(0, 22)}…` : value)}
          />
          <Tooltip
            formatter={(value) => [formatVND(value), label || "Doanh thu"]}
            contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }}
          />
          <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}