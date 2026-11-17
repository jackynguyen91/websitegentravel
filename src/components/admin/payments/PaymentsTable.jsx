import { CheckCircle2, Circle } from "lucide-react";
import { formatDateVN, formatVND } from "@/lib/format";
import { METHOD_STYLE, PAYMENT_STATUS_STYLE } from "@/lib/payment-utils";

export default function PaymentsTable({ items, loading, onToggleReconcile }) {
  if (loading) {
    return (
      <div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-11 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="grid h-40 place-items-center rounded-2xl border border-slate-100 bg-white text-sm text-slate-500 shadow-card">Chưa có giao dịch nào khớp bộ lọc.</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] text-left text-[13px]">
          <thead className="bg-cloud text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Ngày</th>
              <th className="px-3 py-3 font-semibold">Đối tượng</th>
              <th className="px-3 py-3 font-semibold">Nội dung</th>
              <th className="px-3 py-3 font-semibold">Phương thức</th>
              <th className="px-3 py-3 text-right font-semibold">Số tiền</th>
              <th className="px-3 py-3 font-semibold">Trạng thái</th>
              <th className="px-3 py-3 text-center font-semibold">Đối soát</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((row) => {
              const isOut = row.direction === "Chi đối tác";
              return (
                <tr key={row.id} className="hover:bg-cloud/60">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDateVN(row.paid_at || row.created_date)}</td>
                  <td className="px-3 py-3">
                    <p className="font-semibold text-ink">{isOut ? row.partner_name || "Đối tác" : row.customer_name || "Khách hàng"}</p>
                    <p className="text-[11.5px] text-slate-500">{isOut ? "Chi trả nhà cung cấp" : row.booking_code || "—"}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold ${isOut ? "border-purple-200 bg-purple-50 text-purple-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                      {isOut ? "Chi" : "Thu"}
                    </span>
                    <span className="ml-1.5 text-[12px] text-slate-600">{row.kind || row.note || "Thanh toán"}</span>
                    {row.receipt_no ? <p className="mt-0.5 text-[10.5px] text-slate-400">Phiếu {row.receipt_no}</p> : null}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold ${METHOD_STYLE[row.method] || METHOD_STYLE["Chuyển khoản"]}`}>
                      {row.method || "Chuyển khoản"}
                    </span>
                  </td>
                  <td className={`whitespace-nowrap px-3 py-3 text-right font-semibold tnum ${isOut ? "text-purple-700" : "text-emerald-700"}`}>
                    {isOut ? "−" : "+"}
                    {formatVND(row.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold ${PAYMENT_STATUS_STYLE[row.status] || PAYMENT_STATUS_STYLE["Chờ xử lý"]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleReconcile(row)}
                      aria-label={row.reconciled ? "Bỏ đối soát" : "Đối soát giao dịch"}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold ${
                        row.reconciled ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500 hover:text-brand"
                      }`}
                    >
                      {row.reconciled ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                      {row.reconciled ? "Đã đối soát" : "Đối soát"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}