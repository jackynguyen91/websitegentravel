export const BOOKING_STATUSES = [
  "Mới",
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đã thanh toán một phần",
  "Đã thanh toán",
  "Hoàn tất",
  "Đã hủy",
  "Hoàn tiền",
];

export const KANBAN_STATUSES = BOOKING_STATUSES;

export const FLOW_STEPS = ["Mới", "Chờ xác nhận", "Đã xác nhận", "Đã thanh toán một phần", "Đã thanh toán", "Hoàn tất"];

export const STATUS_STYLE = {
  "Mới": "bg-slate-100 text-slate-700 border-slate-200",
  "Chờ xác nhận": "bg-amber-50 text-amber-700 border-amber-200",
  "Đã xác nhận": "bg-sky-50 text-sky-700 border-sky-200",
  "Đã thanh toán một phần": "bg-violet-50 text-violet-700 border-violet-200",
  "Đã thanh toán": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Hoàn tất": "bg-teal-50 text-teal-700 border-teal-200",
  "Đã hủy": "bg-rose-50 text-rose-700 border-rose-200",
  "Hoàn tiền": "bg-pink-50 text-pink-700 border-pink-200",
};

export const STATUS_DOT = {
  "Mới": "bg-slate-400",
  "Chờ xác nhận": "bg-amber-500",
  "Đã xác nhận": "bg-sky-500",
  "Đã thanh toán một phần": "bg-violet-500",
  "Đã thanh toán": "bg-emerald-500",
  "Hoàn tất": "bg-teal-500",
  "Đã hủy": "bg-rose-500",
  "Hoàn tiền": "bg-pink-500",
};

export const PAYMENT_OPTIONS = ["Unpaid", "Pending Verification", "Partial", "Paid"];

export const PAYMENT_LABEL = {
  Unpaid: "Chưa thanh toán",
  "Pending Verification": "Chờ kiểm tra",
  Partial: "Thanh toán một phần",
  Paid: "Đã thanh toán",
};

export const PAYMENT_STYLE = {
  Unpaid: "bg-amber-50 text-amber-700 border-amber-200",
  "Pending Verification": "bg-sky-50 text-sky-700 border-sky-200",
  Partial: "bg-violet-50 text-violet-700 border-violet-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export const PAYMENT_METHODS = ["VietQR", "Chuyển khoản", "Tiền mặt", "Thẻ tín dụng", "Đại lý thu"];

export const isPaid = (booking) => booking?.payment_status === "Paid";

export function paidOf(booking) {
  const paid = Number(booking?.paid_amount) || 0;
  if (paid > 0) return paid;
  return isPaid(booking) ? Number(booking?.total_price) || 0 : 0;
}

export function statusStyle(status) {
  return STATUS_STYLE[status] || "bg-slate-100 text-slate-600 border-slate-200";
}