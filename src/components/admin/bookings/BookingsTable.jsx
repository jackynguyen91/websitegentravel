import { ArrowDown, ArrowUp } from "lucide-react";
import { PAYMENT_LABEL, PAYMENT_STYLE, statusStyle } from "@/lib/booking-status";
import { formatDateVN, formatVND } from "@/lib/format";

function SortHead({ label, column, sort, onSort }) {
  const active = sort?.startsWith(column);
  const ascending = sort === `${column}-asc`;
  return (
    <th className="px-3 py-3 font-semibold">
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`inline-flex items-center gap-1 uppercase tracking-[0.08em] transition hover:text-ink ${active ? "text-ink" : ""}`}
      >
        {label}
        {active ? ascending ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" /> : null}
      </button>
    </th>
  );
}

export default function BookingsTable({ items, selected, onToggle, onToggleAll, onOpen, sort, onSort, loading }) {
  const allSelected = items.length > 0 && items.every((item) => selected.includes(item.id));

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead className="bg-cloud text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="w-9 px-2 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => onToggleAll(event.target.checked)}
                  aria-label="Chọn tất cả"
                  className="h-3.5 w-3.5 rounded border-slate-300 text-brand focus:ring-brand"
                />
              </th>
              <th className="px-3 py-3 font-semibold">Mã đơn</th>
              <th className="px-3 py-3 font-semibold">Khách hàng</th>
              <th className="px-3 py-3 font-semibold">Trạng thái</th>
              <SortHead label="Giá trị" column="total" sort={sort} onSort={onSort} />
              <SortHead label="Khởi hành" column="departure" sort={sort} onSort={onSort} />
              <th className="px-3 py-3 font-semibold">Tour</th>
              <th className="px-3 py-3 font-semibold">Thanh toán</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading &&
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td colSpan={8} className="px-3 py-3">
                    <div className="h-6 animate-pulse rounded bg-slate-100" />
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-16 text-center text-[13px] text-slate-500">
                  Không có đơn nào khớp bộ lọc hiện tại.
                </td>
              </tr>
            )}

            {!loading &&
              items.map((booking) => (
                <tr key={booking.id} className="align-middle transition hover:bg-cloud/60">
                  <td className="px-2 py-2.5">
                    <input
                      type="checkbox"
                      checked={selected.includes(booking.id)}
                      onChange={() => onToggle(booking.id)}
                      aria-label={`Chọn đơn ${booking.code}`}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-brand focus:ring-brand"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => onOpen(booking.id)}
                      className="font-heading text-[12.5px] font-bold text-brand hover:underline"
                    >
                      {booking.code}
                    </button>
                    <p className="text-[10.5px] text-slate-400">{formatDateVN(booking.booking_date)}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="truncate font-semibold text-ink">{booking.customer_name}</p>
                    <p className="truncate text-[11px] text-slate-500">
                      {booking.customer_phone} · {booking.channel}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold ${statusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-ink tnum">{formatVND(booking.total)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-slate-600">
                    {formatDateVN(booking.departure_date)}
                    <span className="block text-[10.5px] text-slate-400">
                      {booking.adults} NL{booking.children > 0 ? ` · ${booking.children} TE` : ""}
                    </span>
                  </td>
                  <td className="max-w-[180px] px-3 py-2.5">
                    <p className="truncate text-[12px] text-slate-700" title={booking.tour_title}>
                      {booking.tour_title}
                    </p>
                    <p className="truncate text-[10.5px] text-slate-400">{booking.sale_owner || "Chưa gán sale"}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <span
                      className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold ${PAYMENT_STYLE[booking.payment_status] || PAYMENT_STYLE.Unpaid}`}
                    >
                      {PAYMENT_LABEL[booking.payment_status] || PAYMENT_LABEL.Unpaid}
                    </span>
                    <span className="block text-[10px] text-slate-400 tnum">Đã thu {formatVND(booking.paid)}</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}