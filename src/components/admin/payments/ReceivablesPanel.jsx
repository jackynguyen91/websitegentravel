import { formatVND } from "@/lib/format";

export default function ReceivablesPanel({ rows, loading, onCollect }) {
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
    return <div className="grid h-40 place-items-center rounded-2xl border border-slate-100 bg-white text-sm text-slate-500 shadow-card">Không còn khoản phải thu nào.</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-[13px]">
          <thead className="bg-cloud text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Đơn / Khách hàng</th>
              <th className="px-3 py-3 font-semibold">Tour</th>
              <th className="px-3 py-3 font-semibold">Khởi hành</th>
              <th className="px-3 py-3 text-right font-semibold">Giá trị đơn</th>
              <th className="px-3 py-3 text-right font-semibold">Đã thu</th>
              <th className="px-3 py-3 text-right font-semibold">Còn phải thu</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(({ booking, total, paid, remaining }) => (
              <tr key={booking.id} className="hover:bg-cloud/60">
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{booking.customer_name}</p>
                  <p className="text-[11.5px] text-slate-500">
                    {booking.booking_code} · {booking.customer_phone}
                  </p>
                </td>
                <td className="px-3 py-3 text-slate-600">
                  <p className="line-clamp-1 max-w-[220px]">{booking.tour_title}</p>
                  <p className="text-[11px] text-slate-400">{booking.channel || "Website"}</p>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-slate-600">{booking.departure_date || "—"}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-slate-600 tnum">{formatVND(total)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-slate-600 tnum">{formatVND(paid)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-bold text-brand tnum">{formatVND(remaining)}</td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onCollect(booking)}
                    className="inline-flex h-8 items-center rounded-lg bg-brand px-3 text-[11.5px] font-semibold text-white"
                  >
                    Thu tiền
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