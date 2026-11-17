import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { bulkBookingStatus, listAdminBookings, sendBookingEmails } from "@/lib/admin-bookings-fns";
import { exportExcel } from "@/lib/admin/export-excel";
import { PAYMENT_LABEL } from "@/lib/booking-status";
import { formatDateVN, formatVND } from "@/lib/format";
import CreateBookingDialog from "@/components/admin/CreateBookingDialog";
import BookingsToolbar from "@/components/admin/bookings/BookingsToolbar";
import BookingsTable from "@/components/admin/bookings/BookingsTable";
import BookingsKanban from "@/components/admin/bookings/BookingsKanban";
import BookingDrawer from "@/components/admin/bookings/BookingDrawer";

export const Route = createFileRoute("/_authed/admin/bookings")({
  head: () => ({ meta: [{ title: "Đơn đặt tour · GenTravel Admin" }] }),
  component: AdminBookings,
});

const DEFAULT_FILTERS = {
  status: "all",
  payment: "all",
  tour_id: "all",
  channel: "all",
  sale: "all",
  from: "",
  to: "",
  sort: "newest",
};

const EXPORT_COLUMNS = [
  { label: "Mã đơn", value: (row) => row.code },
  { label: "Ngày đặt", value: (row) => formatDateVN(row.booking_date, true) },
  { label: "Khách hàng", value: (row) => row.customer_name },
  { label: "Điện thoại", value: (row) => row.customer_phone },
  { label: "Email", value: (row) => row.customer_email },
  { label: "Tour", value: (row) => row.tour_title },
  { label: "Khởi hành", value: (row) => formatDateVN(row.departure_date) },
  { label: "Người lớn", value: (row) => row.adults },
  { label: "Trẻ em", value: (row) => row.children },
  { label: "Tổng tiền", value: (row) => row.total },
  { label: "Đã thu", value: (row) => row.paid },
  { label: "Thanh toán", value: (row) => PAYMENT_LABEL[row.payment_status] || row.payment_status },
  { label: "Trạng thái", value: (row) => row.status },
  { label: "Kênh", value: (row) => row.channel },
  { label: "Sale", value: (row) => row.sale_owner },
];

function AdminBookings() {
  const listBookings = useServerFn(listAdminBookings);
  const setBulkStatus = useServerFn(bulkBookingStatus);
  const sendEmails = useServerFn(sendBookingEmails);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [view, setView] = useState("table");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [detailId, setDetailId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [busy, setBusy] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listBookings({
        data: {
          q: debouncedSearch || undefined,
          status: filters.status === "all" ? undefined : filters.status,
          payment: filters.payment === "all" ? undefined : filters.payment,
          tour_id: filters.tour_id === "all" ? undefined : filters.tour_id,
          channel: filters.channel === "all" ? undefined : filters.channel,
          sale: filters.sale === "all" ? undefined : filters.sale,
          from: filters.from || undefined,
          to: filters.to || undefined,
          sort: filters.sort,
        },
      });
      setData(result);
      setSelected((prev) => prev.filter((id) => result.items.some((item) => item.id === id)));
    } catch (error) {
      toast.error("Không tải được danh sách đơn.");
    } finally {
      setLoading(false);
    }
  }, [listBookings, debouncedSearch, filters]);

  useEffect(() => {
    load();
  }, [load]);

  const items = data?.items ?? [];
  const selectedItems = useMemo(() => items.filter((item) => selected.includes(item.id)), [items, selected]);

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const toggleAll = (checked) => setSelected(checked ? items.map((item) => item.id) : []);

  const onSort = (column) =>
    setFilters((prev) => {
      if (column === "total") return { ...prev, sort: prev.sort === "total-desc" ? "total-asc" : "total-desc" };
      if (column === "departure") return { ...prev, sort: "departure-asc" };
      return { ...prev, sort: prev.sort === "newest" ? "oldest" : "newest" };
    });

  const runBulkStatus = async () => {
    if (!selected.length) return;
    setBusy("status");
    try {
      const result = await setBulkStatus({ data: { ids: selected, status: "Đã xác nhận" } });
      toast.success(`Đã xác nhận ${result.updated} đơn`);
      setSelected([]);
      await load();
    } catch (error) {
      toast.error("Không cập nhật được các đơn đã chọn.");
    } finally {
      setBusy("");
    }
  };

  const runBulkEmail = async () => {
    if (!selected.length) return;
    setBusy("email");
    try {
      const result = await sendEmails({ data: { ids: selected.slice(0, 20) } });
      toast.success(`Đã gửi ${result.sent} email${result.skipped ? `, bỏ qua ${result.skipped} đơn thiếu email` : ""}`);
      await load();
    } catch (error) {
      toast.error("Không gửi được email.");
    } finally {
      setBusy("");
    }
  };

  const exportRows = () => {
    const rows = selectedItems.length ? selectedItems : items;
    if (!rows.length) {
      toast.error("Không có đơn nào để xuất.");
      return;
    }
    exportExcel(`don-dat-tour-${Date.now()}`, EXPORT_COLUMNS, rows);
  };

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink">Đơn đặt tour</h1>
          <p className="mt-0.5 text-[12.5px] text-slate-500">
            {data ? `${data.total} đơn khớp bộ lọc · ${formatVND(data.totals.value)} giá trị · đã thu ${formatVND(data.totals.collected)}` : "Đang tải dữ liệu…"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportRows}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[12.5px] font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
          >
            <Download className="h-4 w-4" /> Xuất Excel
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-[12.5px] font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> Tạo đơn thủ công
          </button>
        </div>
      </header>

      <BookingsToolbar
        search={search}
        onSearch={setSearch}
        filters={filters}
        onFilter={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        facets={data?.facets}
        view={view}
        onView={setView}
        onRefresh={load}
        loading={loading}
        selected={selected}
        onClearSelection={() => setSelected([])}
        onBulkStatus={runBulkStatus}
        onBulkEmail={runBulkEmail}
        onExport={exportRows}
        busy={busy}
      />

      {view === "table" ? (
        <BookingsTable
          items={items}
          selected={selected}
          onToggle={toggle}
          onToggleAll={toggleAll}
          onOpen={setDetailId}
          sort={filters.sort}
          onSort={onSort}
          loading={loading}
        />
      ) : (
        <BookingsKanban items={items} onOpen={setDetailId} loading={loading} />
      )}

      <BookingDrawer bookingId={detailId} onClose={() => setDetailId(null)} onChanged={load} />

      <CreateBookingDialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) load();
        }}
      />
    </div>
  );
}