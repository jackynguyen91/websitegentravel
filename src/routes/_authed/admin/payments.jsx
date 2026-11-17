import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, QrCode, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import PaymentsTable from "@/components/admin/payments/PaymentsTable";
import PaymentDialog from "@/components/admin/payments/PaymentDialog";
import VietQrSettingsDialog from "@/components/admin/payments/VietQrSettingsDialog";
import ReceivablesPanel from "@/components/admin/payments/ReceivablesPanel";
import PayablesPanel from "@/components/admin/payments/PayablesPanel";
import { payablesOf, receivablesOf, METHOD_STYLE } from "@/lib/payment-utils";
import { logActivity } from "@/lib/activity";
import { formatVND } from "@/lib/format";

export const Route = createFileRoute("/_authed/admin/payments")({
  component: AdminPayments,
});

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));
const METHODS = ["Chuyển khoản", "VNPay", "MoMo", "Tiền mặt", "VietQR", "Thẻ tín dụng", "Đại lý thu"];
const STATUSES = ["Đã thanh toán", "Chờ xử lý", "Thất bại", "Đã hoàn tiền"];

function AdminPayments() {
  const { user } = useAuth();
  const [tab, setTab] = useState("transactions");
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [partners, setPartners] = useState([]);
  const [tours, setTours] = useState([]);
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [direction, setDirection] = useState("all");
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [vietQrOpen, setVietQrOpen] = useState(false);
  const [presetBooking, setPresetBooking] = useState(null);
  const [presetPartner, setPresetPartner] = useState(null);

  const load = async () => {
    const [paymentRows, bookingRows, partnerRows, tourRows, costRows] = await Promise.all([
      base44.entities.Payment.list({ sort: "-paid_at", limit: 500 }),
      base44.entities.Booking.list({ sort: "-booking_date", limit: 500 }),
      base44.entities.Partner.list({ sort: "name", limit: 200 }),
      base44.entities.Tour.list({ limit: 200 }),
      base44.entities.TourCost.list({ limit: 500 }),
    ]);
    setPayments(asArray(paymentRows));
    setBookings(asArray(bookingRows));
    setPartners(asArray(partnerRows));
    setTours(asArray(tourRows));
    setCosts(asArray(costRows));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const receivables = useMemo(() => receivablesOf(bookings, payments), [bookings, payments]);
  const payables = useMemo(
    () => payablesOf({ partners, tours, costs, bookings, payments }),
    [partners, tours, costs, bookings, payments],
  );

  const totals = useMemo(() => {
    const received = payments
      .filter((row) => row.direction !== "Chi đối tác" && row.status === "Đã thanh toán")
      .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
    const paidOut = payments
      .filter((row) => row.direction === "Chi đối tác" && row.status === "Đã thanh toán")
      .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
    const unreconciled = payments.filter((row) => !row.reconciled);
    return {
      received,
      paidOut,
      unreconciledCount: unreconciled.length,
      unreconciledAmount: unreconciled.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
      receivableTotal: receivables.reduce((sum, row) => sum + row.remaining, 0),
      payableTotal: payables.reduce((sum, row) => sum + row.remaining, 0),
    };
  }, [payments, receivables, payables]);

  const visiblePayments = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return payments.filter((row) => {
      const directionOk = direction === "all" || row.direction === direction;
      const methodOk = method === "all" || row.method === method;
      const statusOk = status === "all" || row.status === status;
      const searchOk =
        !search ||
        [row.customer_name, row.partner_name, row.booking_code, row.receipt_no, row.note]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search));
      return directionOk && methodOk && statusOk && searchOk;
    });
  }, [payments, keyword, direction, method, status]);

  const toggleReconcile = async (row) => {
    const reconciled = !row.reconciled;
    await base44.entities.Payment.update(row.id, {
      reconciled,
      reconciled_at: reconciled ? new Date().toISOString() : "",
    });
    await logActivity({
      module: "Thanh toán",
      action: reconciled ? "Đối soát giao dịch" : "Bỏ đối soát giao dịch",
      detail: `${formatVND(row.amount)} · ${row.booking_code || row.partner_name || ""}`,
      entity_id: row.id,
      actor: user?.full_name || user?.email || "",
    });
    await load();
  };

  const openCollect = (booking) => {
    setPresetPartner(null);
    setPresetBooking(booking);
    setDialogOpen(true);
  };

  const openPayout = (partner) => {
    setPresetBooking(null);
    setPresetPartner(partner);
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink">Thanh toán & công nợ</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Đã thu {formatVND(totals.received)} · phải thu {formatVND(totals.receivableTotal)} · phải trả {formatVND(totals.payableTotal)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setVietQrOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 hover:bg-cloud"
          >
            <QrCode className="h-4 w-4" /> Cấu hình VietQR
          </button>
          <button
            type="button"
            onClick={() => {
              setPresetBooking(null);
              setPresetPartner(null);
              setDialogOpen(true);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Ghi nhận giao dịch
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Đã thu", value: formatVND(totals.received), hint: `Đã chi ${formatVND(totals.paidOut)}` },
          { label: "Phải thu khách", value: formatVND(totals.receivableTotal), hint: `${receivables.length} đơn còn nợ` },
          { label: "Phải trả đối tác", value: formatVND(totals.payableTotal), hint: `${payables.length} nhà cung cấp` },
          {
            label: "Chưa đối soát",
            value: String(totals.unreconciledCount),
            hint: formatVND(totals.unreconciledAmount),
          },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-card">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-500">{item.label}</p>
            <p className="mt-1 text-[16px] font-bold text-ink tnum">{item.value}</p>
            <p className="text-[10.5px] text-slate-400">{item.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-1.5 rounded-xl border border-slate-100 bg-white p-1.5 shadow-card">
        {[
          { key: "transactions", label: "Giao dịch" },
          { key: "receivables", label: `Phải thu (${receivables.length})` },
          { key: "payables", label: `Phải trả (${payables.length})` },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`h-9 flex-1 rounded-lg px-3 text-[12.5px] font-semibold transition ${tab === item.key ? "bg-brand text-white" : "text-slate-600 hover:bg-cloud"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "transactions" ? (
        <>
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-card lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm khách, đối tác, mã đơn, số phiếu…"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[12.5px] text-ink outline-none focus:border-brand"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <select value={direction} onChange={(e) => setDirection(e.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-[12px] text-slate-600">
                <option value="all">Mọi loại</option>
                <option value="Thu từ khách">Thu từ khách</option>
                <option value="Chi đối tác">Chi đối tác</option>
              </select>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-[12px] text-slate-600">
                <option value="all">Mọi phương thức</option>
                {METHODS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-[12px] text-slate-600">
                <option value="all">Mọi trạng thái</option>
                {STATUSES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <PaymentsTable items={visiblePayments} loading={loading} onToggleReconcile={toggleReconcile} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {METHODS.map((item) => (
              <span key={item} className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold ${METHOD_STYLE[item]}`}>
                {item}
              </span>
            ))}
          </div>
        </>
      ) : null}

      {tab === "receivables" ? (
        <div className="mt-3">
          <ReceivablesPanel rows={receivables} loading={loading} onCollect={openCollect} />
        </div>
      ) : null}

      {tab === "payables" ? (
        <div className="mt-3">
          <PayablesPanel rows={payables} loading={loading} onPay={openPayout} />
        </div>
      ) : null}

      <VietQrSettingsDialog open={vietQrOpen} onOpenChange={setVietQrOpen} />

      <PaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        bookings={bookings}
        partners={partners}
        payments={payments}
        presetBooking={presetBooking}
        presetPartner={presetPartner}
        onSaved={load}
      />
    </div>
  );
}