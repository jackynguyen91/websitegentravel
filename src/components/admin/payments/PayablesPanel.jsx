import { formatVND } from "@/lib/format";

export default function PayablesPanel({ rows, loading, onPay }) {
  if (loading) {
    return (
      <div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-11 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return <div className="grid h-40 place-items-center rounded-2xl border border-slate-100 bg-white text-sm text-slate-500 shadow-card">Chưa ghi nhận chi phí đối tác nào.</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-[13px]">
          <thead className="bg-cloud text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Đối tác</th>
              <th className="px-3 py-3 font-semibold">Loại</th>
              <th className="px-3 py-3 text-right font-semibold">Chi phí ghi nhận</th>
              <th className="px-3 py-3 text-right font-semibold">Đã chi</th>
              <th className="px-3 py-3 text-right font-semibold">Chờ xử lý</th>
              <th className="px-3 py-3 text-right font-semibold">Còn phải trả</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(({ partner, cost, paid, pending, remaining }) => (
              <tr key={partner.id} className="hover:bg-cloud/60">
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{partner.name}</p>
                  <p className="text-[11.5px] text-slate-500">{partner.contact_person || partner.city || "—"}</p>
                </td>
                <td className="px-3 py-3 text-slate-600">{partner.type}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-slate-600 tnum">{formatVND(cost)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-slate-600 tnum">{formatVND(paid)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-amber-600 tnum">{formatVND(pending)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-bold text-ink tnum">{formatVND(remaining)}</td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onPay(partner)}
                    className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-[11.5px] font-semibold text-slate-600 hover:text-brand"
                  >
                    Chi tiền
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