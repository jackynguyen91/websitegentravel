import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, Download, Loader2, Mail, MapPin, Phone, UserRound, Users } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  addBookingNote,
  addBookingPayment,
  getBookingDetail,
  sendBookingEmails,
  updateBookingStatus,
} from "@/lib/admin-bookings-fns";
import { BOOKING_STATUSES, FLOW_STEPS, STATUS_DOT, statusStyle } from "@/lib/booking-status";
import { formatDateVN, formatVND } from "@/lib/format";
import { downloadInvoicePdf } from "@/lib/admin/invoice-pdf";
import BookingPaymentPanel from "./BookingPaymentPanel";
import BookingNotesTimeline from "./BookingNotesTimeline";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
    <div className="min-w-0">
      <p className="text-[10.5px] uppercase tracking-[0.06em] text-slate-400">{label}</p>
      <p className="truncate text-[12.5px] font-medium text-ink">{value || "—"}</p>
    </div>
  </div>
);

export default function BookingDrawer({ bookingId, onClose, onChanged }) {
  const loadDetail = useServerFn(getBookingDetail);
  const changeStatus = useServerFn(updateBookingStatus);
  const sendEmail = useServerFn(sendBookingEmails);
  const addNote = useServerFn(addBookingNote);
  const addPayment = useServerFn(addBookingPayment);

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState("");

  const refresh = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    try {
      const result = await loadDetail({ data: { id: bookingId } });
      setDetail(result);
    } finally {
      setLoading(false);
    }
  }, [bookingId, loadDetail]);

  useEffect(() => {
    if (!bookingId) {
      setDetail(null);
      return;
    }
    refresh();
  }, [bookingId, refresh]);

  const booking = detail?.booking;
  const passengers =
    booking?.passengers?.length > 0
      ? booking.passengers
      : booking
        ? [
            { full_name: booking.customer_name, type: "Người đại diện" },
            ...Array.from({ length: Number(booking.children_count) || 0 }, () => ({ full_name: "Trẻ em", type: "Trẻ em" })),
          ]
        : [];

  const changeTo = async (status) => {
    if (!booking || status === booking.status) return;
    setBusy("status");
    try {
      const result = await changeStatus({ data: { id: booking.id, status } });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      await refresh();
      onChanged?.();
      toast.success(`Đã chuyển sang “${status}”`);
    } catch (error) {
      toast.error("Không cập nhật được trạng thái.");
    } finally {
      setBusy("");
    }
  };

  const submitNote = async (text) => {
    setBusy("note");
    try {
      const result = await addNote({ data: { id: booking.id, text } });
      if (result?.error) {
        toast.error(result.error);
        return false;
      }
      await refresh();
      onChanged?.();
      return true;
    } catch (error) {
      toast.error("Không lưu được ghi chú.");
      return false;
    } finally {
      setBusy("");
    }
  };

  const submitPayment = async (payload) => {
    setBusy("payment");
    try {
      const result = await addPayment({ data: { id: booking.id, ...payload } });
      if (result?.error) {
        toast.error(result.error);
        return false;
      }
      await refresh();
      onChanged?.();
      toast.success(`Đã ghi nhận ${formatVND(payload.amount)}`);
      return true;
    } catch (error) {
      toast.error("Không ghi nhận được thanh toán.");
      return false;
    } finally {
      setBusy("");
    }
  };

  const emailCustomer = async () => {
    setBusy("email");
    try {
      const result = await sendEmail({ data: { ids: [booking.id] } });
      if (result?.sent) {
        toast.success(`Đã gửi email xác nhận tới ${booking.customer_email}`);
        await refresh();
        onChanged?.();
      } else {
        toast.error("Đơn chưa có email khách hàng hoặc gửi thất bại.");
      }
    } catch (error) {
      toast.error("Không gửi được email.");
    } finally {
      setBusy("");
    }
  };

  const printPdf = async () => {
    setBusy("pdf");
    try {
      await downloadInvoicePdf(booking, detail?.payments || []);
    } catch (error) {
      toast.error("Không tạo được file PDF.");
    } finally {
      setBusy("");
    }
  };

  const flowIndex = booking ? FLOW_STEPS.indexOf(booking.status) : -1;

  return (
    <Sheet open={Boolean(bookingId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-[620px]">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 py-3">
          <SheetHeader className="space-y-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <SheetTitle className="font-heading text-lg font-extrabold text-ink">
                {booking ? `Đơn ${booking.booking_code}` : "Chi tiết đơn"}
              </SheetTitle>
              {booking && (
                <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${statusStyle(booking.status)}`}>{booking.status}</span>
              )}
            </div>
            <SheetDescription className="text-[12px] text-slate-500">
              {booking ? `${booking.customer_name} · ${booking.customer_phone}` : "Đang tải thông tin đơn…"}
            </SheetDescription>
          </SheetHeader>

          {booking && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <select
                value={booking.status}
                onChange={(event) => changeTo(event.target.value)}
                disabled={busy === "status"}
                aria-label="Cập nhật trạng thái đơn"
                className={`h-8 rounded-lg border px-2 text-[11.5px] font-semibold outline-none ${statusStyle(booking.status)}`}
              >
                {BOOKING_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={emailCustomer}
                disabled={busy === "email"}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-[11.5px] font-semibold text-slate-600 transition hover:border-brand hover:text-brand disabled:opacity-60"
              >
                {busy === "email" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />} Email xác nhận
              </button>
              <button
                type="button"
                onClick={printPdf}
                disabled={busy === "pdf"}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-[11.5px] font-semibold text-slate-600 transition hover:border-brand hover:text-brand disabled:opacity-60"
              >
                {busy === "pdf" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} In PDF
              </button>
            </div>
          )}

          {booking && flowIndex >= 0 && (
            <ol className="mt-2.5 flex flex-wrap items-center gap-1">
              {FLOW_STEPS.map((step, index) => (
                <li key={step} className="flex items-center gap-1">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                      index <= flowIndex ? "bg-brand-50 text-brand" : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${index <= flowIndex ? STATUS_DOT[step] : "bg-slate-300"}`} />
                    {step}
                  </span>
                  {index < FLOW_STEPS.length - 1 && <span className="h-px w-2 bg-slate-200" />}
                </li>
              ))}
            </ol>
          )}

          {booking && flowIndex < 0 && (
            <p className="mt-2 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[11.5px] font-medium text-rose-700">
              Đơn đang ở trạng thái “{booking.status}” — ngoài quy trình bán hàng thông thường.
            </p>
          )}
        </div>

        {!booking && (
          <div className="grid flex-1 place-items-center py-16 text-[13px] text-slate-400">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Không tìm thấy đơn."}
          </div>
        )}

        {booking && (
          <div className="space-y-3 p-4">
            <section className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Người đặt</h3>
              <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                <InfoRow icon={UserRound} label="Họ tên" value={booking.customer_name} />
                <InfoRow icon={Phone} label="Điện thoại" value={booking.customer_phone} />
                <InfoRow icon={Mail} label="Email" value={booking.customer_email} />
                <InfoRow icon={CalendarDays} label="Ngày đặt" value={formatDateVN(booking.booking_date || booking.created_date, true)} />
                <InfoRow icon={MapPin} label="Kênh bán" value={booking.channel} />
                <InfoRow icon={Users} label="Nhân viên sale" value={booking.sale_owner} />
              </div>
              {booking.special_requests && (
                <p className="mt-2 rounded-lg bg-cloud px-2.5 py-1.5 text-[12px] text-slate-600">
                  <span className="font-semibold text-slate-500">Yêu cầu: </span>
                  {booking.special_requests}
                </p>
              )}
            </section>

            <section className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Tour &amp; khởi hành</h3>
              <p className="mt-1.5 text-[13px] font-semibold text-ink">{booking.tour_title}</p>
              <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                <InfoRow icon={CalendarDays} label="Ngày khởi hành" value={formatDateVN(booking.departure_date)} />
                <InfoRow
                  icon={Users}
                  label="Số khách"
                  value={`${Number(booking.adults_count) || 0} người lớn · ${Number(booking.children_count) || 0} trẻ em`}
                />
              </div>

              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400">Hành khách ({passengers.length})</p>
              <ul className="mt-1 divide-y divide-slate-100">
                {passengers.map((passenger, index) => (
                  <li key={`${passenger.full_name}-${index}`} className="flex items-center justify-between gap-2 py-1.5">
                    <span className="truncate text-[12.5px] text-ink">
                      {index + 1}. {passenger.full_name}
                    </span>
                    <span className="shrink-0 rounded-md bg-cloud px-1.5 py-0.5 text-[10.5px] font-medium text-slate-500">
                      {passenger.type || "Người lớn"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <BookingPaymentPanel
              booking={booking}
              payments={detail?.payments || []}
              onAddPayment={submitPayment}
              busy={busy}
            />

            <BookingNotesTimeline booking={booking} onAddNote={submitNote} busy={busy} />

            {detail?.customer && (
              <p className="px-1 text-[11.5px] text-slate-400">
                Hồ sơ CRM: {detail.customer.full_name} · hạng {detail.customer.tier}
                {detail.customer.tags?.length ? ` · ${detail.customer.tags.join(", ")}` : ""}
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}