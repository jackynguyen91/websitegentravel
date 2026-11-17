import { formatDateVN, formatVND } from "@/lib/format";
import { tierStyle } from "@/lib/customer-tier";

export default function CustomersTable({ items, onOpen, loading }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead className="bg-cloud text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Khách hàng</th>
              <th className="px-4 py-3 font-semibold">Liên hệ</th>
              <th className="px-4 py-3 font-semibold">Hạng · Thẻ</th>
              <th className="px-3 py-3 text-center font-semibold">Số đơn</th>
              <th className="px-3 py-3 text-right font-semibold">Tổng chi tiêu</th>
              <th className="px-3 py-3 font-semibold">Đơn gần nhất</th>
              <th className="px-3 py-3 font-semibold">Sinh nhật</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading &&
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td colSpan={8} className="px-4 py-3">
                    <div className="h-6 animate-pulse rounded bg-slate-100" />
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-[13px] text-slate-500">
                  Không có khách hàng nào khớp bộ lọc.
                </td>
              </tr>
            )}

            {!loading &&
              items.map((customer) => (
                <tr key={customer.id} className="align-middle transition hover:bg-cloud/60">
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => onOpen(customer.id)} className="text-left">
                      <p className="font-semibold text-ink hover:text-brand">{customer.full_name}</p>
                      <p className="truncate text-[11.5px] text-slate-500">{customer.email || "—"}</p>
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="text-slate-700">{customer.phone}</p>
                    <p className="text-[11.5px] text-slate-400">{customer.city || "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${tierStyle(customer.tier)}`}>
                      {customer.tier}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(customer.tags || []).slice(0, 2).map((tag) => (
                        <span key={tag} className="rounded-md bg-cloud px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center text-slate-600 tnum">{customer.orders}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-ink tnum">{formatVND(customer.spend)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-[12px] text-slate-600">
                    {customer.last_order ? formatDateVN(customer.last_order) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-[12px] text-slate-600">
                    {customer.birthday ? formatDateVN(customer.birthday) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    <button type="button" onClick={() => onOpen(customer.id)} className="text-[12px] font-semibold text-brand hover:underline">
                      Hồ sơ
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