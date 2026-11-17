import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import DepartureMonthGrid from "@/components/admin/departures/DepartureMonthGrid";
import DepartureDayPanel from "@/components/admin/departures/DepartureDayPanel";
import DepartureEditorDialog from "@/components/admin/departures/DepartureEditorDialog";
import { departureView } from "@/lib/departure-seats";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatVND } from "@/lib/format";

export const Route = createFileRoute("/_authed/admin/departures")({
  component: AdminDepartures,
});

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));

function AdminDepartures() {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(today.toISOString().slice(0, 10));
  const [departures, setDepartures] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    const [departureRows, bookingRows, tourRows] = await Promise.all([
      base44.entities.Departure.list({ sort: "departure_date", limit: 500 }),
      base44.entities.Booking.list({ sort: "-booking_date", limit: 500 }),
      base44.entities.Tour.list({ sort: "title", limit: 200 }),
    ]);
    const views = asArray(departureRows).map((row) => departureView(row, asArray(bookingRows)));
    setDepartures(views);
    setBookings(asArray(bookingRows));
    setTours(asArray(tourRows));
    setLoading(false);

    // Tự đóng bán: đồng bộ chỗ đã bán + trạng thái theo số liệu thực tế.
    const raw = asArray(departureRows);
    const stale = views
      .filter((view) => {
        const saved = raw.find((row) => row.id === view.id);
        return saved && (Number(saved.seats_booked) !== view.booked || saved.status !== view.status);
      })
      .map((view) => ({ id: view.id, seats_booked: view.booked, status: view.status }));
    if (stale.length > 0) await base44.entities.Departure.bulkUpdate(stale);
  };

  useEffect(() => {
    load();
  }, []);

  const monthPrefix = `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}`;

  const byDate = useMemo(() => {
    const map = {};
    departures
      .filter((item) => String(item.departure_date || "").startsWith(monthPrefix))
      .forEach((item) => {
        const key = String(item.departure_date).slice(0, 10);
        map[key] = [...(map[key] || []), item];
      });
    return map;
  }, [departures, monthPrefix]);

  const monthSummary = useMemo(() => {
    const items = Object.values(byDate).flat();
    const revenueFor = (departure) =>
      bookings
        .filter(
          (booking) =>
            booking.tour_id === departure.tour_id &&
            String(booking.departure_date || "").slice(0, 10) === String(departure.departure_date || "").slice(0, 10) &&
            !["Đã hủy", "Hoàn tiền"].includes(booking.status),
        )
        .reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0);

    return items.reduce(
      (acc, item) => ({
        trips: acc.trips + 1,
        total: acc.total + item.total,
        booked: acc.booked + item.booked,
        held: acc.held + item.held,
        remaining: acc.remaining + item.remaining,
        soldOut: acc.soldOut + (item.status === "Đã đầy" ? 1 : 0),
        revenue: acc.revenue + revenueFor(item),
      }),
      { trips: 0, total: 0, booked: 0, held: 0, remaining: 0, soldOut: 0, revenue: 0 },
    );
  }, [byDate, bookings]);

  const dayItems = useMemo(() => byDate[selected] || [], [byDate, selected]);

  // Ngày đang chọn không có chuyến thì nhảy tới ngày gần nhất có chuyến trong tháng.
  useEffect(() => {
    if (loading) return;
    const dates = Object.keys(byDate).sort();
    if (dates.length === 0 || byDate[selected]) return;
    setSelected(dates.find((date) => date >= selected) || dates[0]);
  }, [byDate, loading, selected]);

  const shiftMonth = (delta) => {
    const next = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
  };

  const openCreate = (date) => {
    setEditing(null);
    setSelected(date);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await base44.entities.Departure.delete(deleting.id);
    setDeleting(null);
    await load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink">Lịch khởi hành & chỗ trống</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            {monthSummary.trips} chuyến trong tháng · {monthSummary.soldOut} chuyến đã đầy · còn {monthSummary.remaining} chỗ
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreate(selected)}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Thêm chuyến
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {[
          { label: "Tổng chỗ mở bán", value: monthSummary.total },
          { label: "Đã bán", value: monthSummary.booked },
          { label: "Đang giữ", value: monthSummary.held },
          { label: "Còn lại", value: monthSummary.remaining },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-card">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-500">{item.label}</p>
            <p className="mt-1 font-heading text-lg font-extrabold text-ink tnum">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-card">
        <button type="button" onClick={() => shiftMonth(-1)} aria-label="Tháng trước" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-brand">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-heading text-[15px] font-bold text-ink">
          Tháng {cursor.month + 1} / {cursor.year}
        </p>
        <button type="button" onClick={() => shiftMonth(1)} aria-label="Tháng sau" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-brand">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="h-[420px] animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-[420px] animate-pulse rounded-2xl bg-slate-100" />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <DepartureMonthGrid year={cursor.year} month={cursor.month} byDate={byDate} selected={selected} onSelect={setSelected} />
          <div className="space-y-3">
            <DepartureDayPanel
              date={selected}
              items={dayItems}
              onCreate={openCreate}
              onEdit={(item) => {
                setEditing(item);
                setDialogOpen(true);
              }}
              onDelete={setDeleting}
            />
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
              <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">Tình hình tháng</p>
              <div className="mt-2 space-y-1.5 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Chuyến đã đầy chỗ</span>
                  <span className="font-semibold text-ink tnum">{monthSummary.soldOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tỷ lệ lấp chỗ</span>
                  <span className="font-semibold text-ink tnum">
                    {monthSummary.total > 0 ? Math.round(((monthSummary.booked + monthSummary.held) / monthSummary.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Doanh thu dự kiến</span>
                  <span className="font-semibold text-ink tnum">{formatVND(monthSummary.revenue)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DepartureEditorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        departure={editing}
        date={selected}
        tours={tours}
        onSaved={load}
      />

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogTitle className="font-heading text-lg font-extrabold text-ink">Xóa chuyến khởi hành?</AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] text-slate-600">
            Chuyến {deleting?.tour_title} ngày {deleting?.departure_date} sẽ bị xóa. Đơn đặt tour đã ghi nhận không bị ảnh hưởng.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600">Giữ lại</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="h-10 rounded-xl bg-red-600 px-4 text-[13px] font-semibold text-white hover:bg-red-700">
              Xóa chuyến
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}