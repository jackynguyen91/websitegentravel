import { formatVND } from "@/lib/format";

export default function SalesPerformanceTable({ rows }) {
  if (rows.length === 0) {
    return <div className="grid h-32 place-items-center rounded-xl bg-cloud text-[12.5px] text-slate-500">Chưa có dữ liệu bán hàng trong kỳ.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead className="text-[10.5px] uppercase tracking-[0.08em] text-slate-500">
          <tr>
            <th className="py-2 pr-3 font-semibold">Nhân viên</th>
            <th className="px-2 py-2 text-center font-semibold">Đơn</th>
            <th className="px-2 py-2 text-center font-semibold">Hủy</th>
            <th className="px-2 py-2 text-right font-semibold">Doanh thu</th>
            <th className="px-2 py-2 text-right font-semibold">TB/đơn</th>
            <th className="px-2 py-2 text-right font-semibold">Tỷ lệ hủy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="py-2.5 pr-3 font-semibold text-ink">{row.name}</td>
              <td className="px-2 py-2.5 text-center text-slate-600 tnum">{row.orders}</td>
              <td className="px-2 py-2.5 text-center text-slate-500 tnum">{row.cancelled}</td>
              <td className="px-2 py-2.5 text-right text-slate-700 tnum">{formatVND(row.revenue)}</td>
              <td className="px-2 py-2.5 text-right text-slate-600 tnum">{formatVND(row.avgOrder)}</td>
              <td className="px-2 py-2.5 text-right">
                <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold tnum ${row.cancelRate > 20 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
                  {row.cancelRate.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}