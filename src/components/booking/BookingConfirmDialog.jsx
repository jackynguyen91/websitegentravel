import { CheckCircle2, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatDateVN, formatVND } from "@/lib/format";

export default function BookingConfirmDialog({ booking, open, onOpenChange }) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <DialogTitle className="mt-3 font-heading text-xl font-extrabold text-ink">
            Xác nhận đặt tour
          </DialogTitle>
          <DialogDescription className="mt-1 text-[13px] text-slate-600">
            Mã đặt chỗ{" "}
            <span className="font-heading text-base font-extrabold tracking-wide text-brand">
              {booking.booking_code}
            </span>
          </DialogDescription>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-[12.5px] font-medium leading-relaxed text-sky-800">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Yêu cầu đặt tour đã được ghi nhận. Chuyên viên GenTravel sẽ liên hệ xác nhận đơn trong 30 phút làm việc.
          </span>
        </div>

        <dl className="mt-4 space-y-2 rounded-xl bg-cloud p-4 text-[13px]">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Tour</dt>
            <dd className="text-right font-medium text-ink">{booking.tour_title}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Ngày khởi hành</dt>
            <dd className="font-medium text-ink">{formatDateVN(booking.departure_date)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Số khách</dt>
            <dd className="font-medium text-ink">
              {booking.adults_count} người lớn, {booking.children_count} trẻ em
            </dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-slate-200 pt-2">
            <dt className="text-slate-500">Tạm tính</dt>
            <dd className="font-heading text-base font-extrabold text-cta">
              {formatVND(booking.total_price)}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-[12px] leading-relaxed text-slate-500">
          Bạn chưa cần thanh toán ngay. Sau khi đơn được xác nhận, GenTravel sẽ gửi hướng dẫn thanh toán qua
          Email/Zalo. Hotline hỗ trợ: 1900 6789.
        </p>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-cta text-sm font-semibold text-white transition hover:bg-cta-hover"
        >
          Xác nhận đặt tour
        </button>
      </DialogContent>
    </Dialog>
  );
}