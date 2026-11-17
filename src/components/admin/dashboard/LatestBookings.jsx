import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Receipt } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatDateVN, formatVND } from "@/lib/format";
import StatusBadge from "@/components/admin/dashboard/StatusBadge";

export default function LatestBookings({ bookings }) {
  const [active, setActive] = useState(null);

  return (
    <section className="rounded-xl border border-slate-200/80 bg-admin-card shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h2 className="text-[13.5px] font-semibold text-ink">Đơn mới nhất</h2>
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-brand hover:underline"
        >
          Xem tất cả <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 py-10 text-center">
          <Receipt className="h-6 w-6 text-slate-300" />
          <p className="text-[12px] text-slate-400">Chưa có đơn nào trong kỳ này</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.08em] text-slate-400">
                <th className="px-4 py-2 font-medium">Mã đơn</th>
                <th className="px-3 py-2 font-medium">Khách hàng</th>
                <th className="px-3 py-2 font-medium">Tour</th>
                <th className="px-3 py-2 text-center font-medium">Khách</th>
                <th className="px-3 py-2 font-medium">Khởi hành</th>
                <th className="px-3 py-2 text-right font-medium">Tổng tiền</th>
                <th className="px-3 py-2 font-medium">Thanh toán</th>
                <th className="px-4 py-2 font-medium">Kênh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => setActive(booking)}
                  className="cursor-pointer text-[12px] transition hover:bg-slate-50/80"
                >
                  <td className="px-4 py-2.5 font-semibold text-brand">{booking.code}</td>
                  <td className="px-3 py-2.5">
                    <p className="font-medium text-ink">{booking.customer}</p>
                    <p className="text-[10.5px] text-slate-400">{booking.phone}</p>
                  </td>
                  <td className="max-w-[190px] px-3 py-2.5">
                    <p className="truncate text-slate-600">{booking.tour}</p>
                  </td>
                  <td className="px-3 py-2.5 text-center text-slate-600 tnum">{booking.pax}</td>
                  <td className="px-3 py-2.5 text-slate-600">{formatDateVN(booking.departure)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-ink tnum">{formatVND(booking.total)}</td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={booking.payment_status} />
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{booking.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-base">Đơn {active?.code}</SheetTitle>
            <SheetDescription className="text-[12.5px] text-slate-500">
              Đặt lúc {formatDateVN(active?.created, true)} · Kênh {active?.channel}
            </SheetDescription>
          </SheetHeader>
          {active && (
            <div className="mt-4 space-y-3">
              <StatusBadge status={active.payment_status} />
              <dl className="space-y-2 text-[13px]">
                {[
                  ["Khách hàng", active.customer],
                  ["Điện thoại", active.phone],
                  ["Tour", active.tour],
                  ["Ngày khởi hành", formatDateVN(active.departure)],
                  ["Số khách", `${active.pax} khách`],
                  ["Tổng tiền", formatVND(active.total)],
                  ["Trạng thái đơn", active.status],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="max-w-[62%] text-right font-medium text-ink">{value || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}