import { CalendarPlus, Pencil, Trash2 } from "lucide-react";
import { departureStatusStyle } from "@/lib/departure-seats";
import { formatDateVN } from "@/lib/format";

export default function DepartureDayPanel({ date, items, onEdit, onCreate, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">Chuyến ngày</p>
          <p className="font-heading text-[15px] font-bold text-ink">{formatDateVN(date)}</p>
        </div>
        <button
          type="button"
          onClick={() => onCreate(date)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-[12px] font-semibold text-white"
        >
          <CalendarPlus className="h-3.5 w-3.5" /> Thêm chuyến
        </button>
      </div>

      <div className="max-h-[520px] space-y-2 overflow-y-auto p-3">
        {items.length === 0 && <p className="px-2 py-10 text-center text-[12.5px] text-slate-500">Ngày này chưa có chuyến khởi hành.</p>}

        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-100 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{item.tour_title}</p>
                <p className="text-[11.5px] text-slate-500">
                  {item.guide_name ? `HDV ${item.guide_name}` : "Chưa gán HDV"} · {item.vehicle || "Chưa gán xe"}
                </p>
              </div>
              <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold ${departureStatusStyle(item.status)}`}>{item.status}</span>
            </div>

            <div className="mt-2 grid grid-cols-4 gap-1 text-center text-[10.5px]">
              <div className="rounded-lg bg-cloud px-1 py-1.5">
                <p className="text-slate-400">Tổng</p>
                <p className="font-semibold text-ink tnum">{item.total}</p>
              </div>
              <div className="rounded-lg bg-cloud px-1 py-1.5">
                <p className="text-slate-400">Đã bán</p>
                <p className="font-semibold text-ink tnum">{item.booked}</p>
              </div>
              <div className="rounded-lg bg-cloud px-1 py-1.5">
                <p className="text-slate-400">Đang giữ</p>
                <p className="font-semibold text-ink tnum">{item.held}</p>
              </div>
              <div className={`rounded-lg px-1 py-1.5 ${item.remaining === 0 ? "bg-red-50" : "bg-emerald-50"}`}>
                <p className={item.remaining === 0 ? "text-red-500" : "text-emerald-600"}>Còn lại</p>
                <p className={`font-semibold tnum ${item.remaining === 0 ? "text-red-600" : "text-emerald-700"}`}>{item.remaining}</p>
              </div>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${item.fill >= 100 ? "bg-red-500" : item.fill >= 80 ? "bg-amber-500" : "bg-brand"}`}
                style={{ width: `${item.fill}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10.5px] text-slate-400 tnum">{item.fill}% chỗ đã dùng</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 px-2 text-[11px] font-semibold text-slate-600 hover:text-brand"
                >
                  <Pencil className="h-3 w-3" /> Sửa
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  aria-label="Xóa chuyến"
                  className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}