import { Receipt } from "lucide-react";
import { formatVND } from "@/lib/format";

export default function TourProfitTable({ rows, onManageCosts, loading }) {
  if (loading) {
    return (
      <div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-11 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-left text-[13px]">
          <thead className="bg-cloud text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Tour</th>
              <th className="px-3 py-3 text-center font-semibold">Đơn</th>
              <th className="px-3 py-3 text-center font-semibold">Khách</th>
              <th className="px-3 py-3 text-right font-semibold">Doanh thu</th>
              <th className="px-3 py-3 text-right font-semibold">Chi phí</th>
              <th className="px-3 py-3 text-right font-semibold">LN gộp</th>
              <th className="px-3 py-3 text-right font-semibold">Biên</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(({ tour, finance }) => (
              <tr key={tour.id} className="hover:bg-cloud/60">
                <td className="px-4 py-3">
                  <p className="truncate font-semibold text-ink">{tour.title}</p>
                  <p className="text-[11.5px] text-slate-500">{tour.destination}</p>
                </td>
                <td className="px-3 py-3 text-center text-slate-600 tnum">{finance.orders}</td>
                <td className="px-3 py-3 text-center text-slate-600 tnum">{finance.pax}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-ink tnum">{formatVND(finance.revenue)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-slate-600 tnum">{formatVND(finance.cost)}</td>
                <td className={`whitespace-nowrap px-3 py-3 text-right font-bold tnum ${finance.profit < 0 ? "text-red-600" : "text-emerald-700"}`}>
                  {formatVND(finance.profit)}
                </td>
                <td className="px-3 py-3 text-right">
                  <span
                    className={`inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-semibold tnum ${
                      finance.margin >= 30 ? "bg-emerald-50 text-emerald-700" : finance.margin >= 15 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {finance.margin.toFixed(1)}%
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onManageCosts(tour)}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[11.5px] font-semibold text-slate-600 hover:text-brand"
                  >
                    <Receipt className="h-3 w-3" /> Chi phí
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}