import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactVND, formatVND } from "@/lib/format";

export default function ProfitChart({ data }) {
  return (
    <div className="h-[236px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 6, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10.5, fill: "#94A3B8" }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10.5, fill: "#94A3B8" }}
            tickFormatter={(value) => formatCompactVND(value)}
            width={62}
          />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
            formatter={(value, name) => [formatVND(value), name]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={7} />
          <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#0F766E" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="cost" name="Chi phí tour" stroke="#F59E0B" strokeWidth={1.6} dot={false} />
          <Line type="monotone" dataKey="profit" name="Lợi nhuận gộp" stroke="#38BDF8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}