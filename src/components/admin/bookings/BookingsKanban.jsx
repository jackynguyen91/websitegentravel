import { KANBAN_STATUSES, STATUS_DOT, statusStyle } from "@/lib/booking-status";
import { formatDateVN, formatVND } from "@/lib/format";

export default function BookingsKanban({ items, onOpen, loading }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {KANBAN_STATUSES.map((status) => {
        const list = items.filter((booking) => booking.status === status);
        const value = list.reduce((sum, booking) => sum + Number(booking.total) || 0, 0);
        return (
          <section key={status} className="flex w-[272px] shrink-0 flex-col rounded-2xl border border-slate-100 bg-slate-50/70">
            <header className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[status] || "bg-slate-400"}`} />
                <span className="truncate text-[12px] font-semibold text-ink">{status}</span>
                <span className="rounded-md bg-white px-1.5 py-0.5 text-[10.5px] font-bold text-slate-500">{list.length}</span>
              </div>
            </header>
            <div className="max-h-[calc(100vh-330px)] space-y-2 overflow-y-auto p-2">
              {loading && <div className="h-16 animate-pulse rounded-xl bg-white" />}
              {!loading && list.length === 0 && <p className="px-1 py-4 text-center text-[11.5px] text-slate-400">Chưa có đơn</p>}
              {!loading &&
                list.map((booking) => (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => onOpen(booking.id)}
                    className="w-full rounded-xl border border-slate-100 bg-white p-2.5 text-left shadow-sm transition hover:border-brand/40 hover:shadow-card"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-heading text-[12.5px] font-bold text-brand">{booking.code}</span>
                      <span className="shrink-0 text-[11.5px] font-semibold text-ink tnum">{formatVND(booking.total)}</span>
                    </div>
                    <p className="mt-1 truncate text-[12.5px] font-semibold text-ink">{booking.customer_name}</p>
                    <p className="truncate text-[11px] text-slate-500">{booking.tour_title}</p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="text-[10.5px] text-slate-400">{formatDateVN(booking.departure_date)}</span>
                      <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle(booking.status)}`}>
                        {booking.adults} NL{booking.children > 0 ? ` · ${booking.children} TE` : ""}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10.5px] text-slate-400">{booking.channel}</span>
                      <span className="text-[10.5px] text-slate-400 tnum">Đã thu {formatVND(booking.paid)}</span>
                    </div>
                  </button>
                ))}
              {!loading && list.length > 0 && (
                <p className="px-1 pt-1 text-[10.5px] text-slate-400 tnum">Tổng giá trị cột: {formatVND(value)}</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}