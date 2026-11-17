import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PartnerDialog, { PARTNER_TYPES } from "@/components/admin/partners/PartnerDialog";
import PartnersTable from "@/components/admin/partners/PartnersTable";
import TourProfitTable from "@/components/admin/partners/TourProfitTable";
import TourCostDialog from "@/components/admin/partners/TourCostDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { tourFinance } from "@/lib/tour-profit";
import { formatVND } from "@/lib/format";

export const Route = createFileRoute("/_authed/admin/partners")({
  component: AdminPartners,
});

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));

function AdminPartners() {
  const [tab, setTab] = useState("partners");
  const [partners, setPartners] = useState([]);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [costTour, setCostTour] = useState(null);

  const load = async () => {
    const [partnerRows, tourRows, bookingRows, costRows] = await Promise.all([
      base44.entities.Partner.list({ sort: "name", limit: 200 }),
      base44.entities.Tour.list({ sort: "title", limit: 200 }),
      base44.entities.Booking.list({ sort: "-booking_date", limit: 500 }),
      base44.entities.TourCost.list({ sort: "-created_date", limit: 500 }),
    ]);
    setPartners(asArray(partnerRows));
    setTours(asArray(tourRows));
    setBookings(asArray(bookingRows));
    setCosts(asArray(costRows));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const visiblePartners = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return partners.filter((partner) => {
      const typeOk = typeFilter === "all" || partner.type === typeFilter;
      const searchOk =
        !search ||
        [partner.name, partner.contact_person, partner.phone, partner.email, partner.city]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search));
      return typeOk && searchOk;
    });
  }, [partners, typeFilter, keyword]);

  const profitRows = useMemo(
    () =>
      tours
        .map((tour) => ({ tour, finance: tourFinance(tour, bookings, costs) }))
        .sort((a, b) => b.finance.profit - a.finance.profit),
    [tours, bookings, costs],
  );

  const profitSummary = useMemo(
    () =>
      profitRows.reduce(
        (acc, row) => ({
          revenue: acc.revenue + row.finance.revenue,
          cost: acc.cost + row.finance.cost,
          profit: acc.profit + row.finance.profit,
        }),
        { revenue: 0, cost: 0, profit: 0 },
      ),
    [profitRows],
  );

  const confirmDelete = async () => {
    if (!deleting) return;
    await base44.entities.Partner.delete(deleting.id);
    setDeleting(null);
    await load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink">Đối tác & nhà cung cấp</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            {partners.length} đối tác · chi phí {formatVND(profitSummary.cost)} · lợi nhuận gộp {formatVND(profitSummary.profit)}
          </p>
        </div>
        {tab === "partners" ? (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Thêm đối tác
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex gap-1.5 rounded-xl border border-slate-100 bg-white p-1.5 shadow-card">
        {[
          { key: "partners", label: "Đối tác" },
          { key: "profit", label: "Chi phí & lợi nhuận tour" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`h-9 flex-1 rounded-lg px-3 text-[12.5px] font-semibold transition ${
              tab === item.key ? "bg-brand text-white" : "text-slate-600 hover:bg-cloud"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "partners" ? (
        <>
          <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-card lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm đối tác, người liên hệ, khu vực…"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[12.5px] text-ink outline-none focus:border-brand"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[{ key: "all", label: "Tất cả" }, ...PARTNER_TYPES.map((type) => ({ key: type, label: type }))].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTypeFilter(item.key)}
                  className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition ${
                    typeFilter === item.key ? "bg-brand text-white" : "bg-cloud text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <PartnersTable
              items={visiblePartners}
              loading={loading}
              onEdit={(partner) => {
                setEditing(partner);
                setDialogOpen(true);
              }}
              onDelete={setDeleting}
            />
          </div>
        </>
      ) : (
        <>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Doanh thu các tour", value: formatVND(profitSummary.revenue) },
              { label: "Tổng chi phí ghi nhận", value: formatVND(profitSummary.cost) },
              {
                label: "Lợi nhuận gộp",
                value: `${formatVND(profitSummary.profit)} · ${profitSummary.revenue > 0 ? ((profitSummary.profit / profitSummary.revenue) * 100).toFixed(1) : "0.0"}%`,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-card">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-[15px] font-bold text-ink tnum">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <TourProfitTable rows={profitRows} loading={loading} onManageCosts={setCostTour} />
          </div>
        </>
      )}

      <PartnerDialog open={dialogOpen} onOpenChange={setDialogOpen} partner={editing} onSaved={load} />
      <TourCostDialog
        open={Boolean(costTour)}
        onOpenChange={(open) => !open && setCostTour(null)}
        tour={costTour}
        partners={partners}
        bookings={bookings}
        costs={costs}
        onSaved={load}
      />

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogTitle className="font-heading text-lg font-extrabold text-ink">Xóa đối tác?</AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] text-slate-600">
            “{deleting?.name}” sẽ bị xóa khỏi danh bạ. Các dòng chi phí đã ghi nhận vẫn được giữ lại.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600">Giữ lại</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="h-10 rounded-xl bg-red-600 px-4 text-[13px] font-semibold text-white hover:bg-red-700">
              Xóa đối tác
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}