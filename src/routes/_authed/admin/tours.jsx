import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import TourEditorDialog from "@/components/admin/tours/TourEditorDialog";
import { Image } from "@/components/ui/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { durationLabel, finalPrice, formatVND } from "@/lib/format";
import { TOUR_STATUSES, tourStatusStyle } from "@/lib/tour-status";
import { slugify } from "@/lib/slugify";

export const Route = createFileRoute("/_authed/admin/tours")({
  component: AdminTours,
});

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));

function AdminTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    const rows = await base44.entities.Tour.list({ sort: "-created_date", limit: 200 });
    setTours(asArray(rows));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const base = tours.reduce((acc, tour) => {
      const status = tour.status || "Đang bán";
      return { ...acc, [status]: (acc[status] || 0) + 1 };
    }, {});
    return { all: tours.length, ...base };
  }, [tours]);

  const visible = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return tours.filter((tour) => {
      const statusOk = statusFilter === "all" || (tour.status || "Đang bán") === statusFilter;
      const searchOk =
        !search ||
        [tour.title, tour.destination, tour.slug, tour.departure_point]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search));
      return statusOk && searchOk;
    });
  }, [tours, statusFilter, keyword]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (tour) => {
    setEditing(tour);
    setDialogOpen(true);
  };

  const openDuplicate = (tour) => {
    const copy = { ...tour };
    delete copy.id;
    delete copy.created_date;
    delete copy.updated_date;
    setEditing({
      ...copy,
      title: `${tour.title} (bản sao)`,
      slug: `${slugify(tour.title)}-ban-sao`,
      status: "Nháp",
      is_featured: false,
    });
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await base44.entities.Tour.delete(deleting.id);
    setDeleting(null);
    await load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink">Quản lý tour</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            {tours.length} tour · {counts["Đang bán"] || 0} đang bán · {counts["Nháp"] || 0} nháp
          </p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-semibold text-white">
          <Plus className="h-4 w-4" /> Thêm tour
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm tour, điểm đến, đường dẫn…"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[12.5px] text-ink outline-none focus:border-brand"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[{ key: "all", label: "Tất cả" }, ...TOUR_STATUSES.map((status) => ({ key: status, label: status }))].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setStatusFilter(item.key)}
                className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition ${
                  statusFilter === item.key ? "bg-brand text-white" : "bg-cloud text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label} ({item.key === "all" ? counts.all : counts[item.key] || 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="grid h-40 place-items-center text-sm text-slate-500">Không có tour nào khớp bộ lọc.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-[13px]">
              <thead className="bg-cloud text-[11px] uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tour</th>
                  <th className="px-3 py-3 font-semibold">Trạng thái</th>
                  <th className="px-3 py-3 font-semibold">Danh mục</th>
                  <th className="px-3 py-3 font-semibold">Thời lượng</th>
                  <th className="px-3 py-3 text-right font-semibold">Giá người lớn</th>
                  <th className="px-3 py-3 text-center font-semibold">Lịch trình</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((tour) => (
                  <tr key={tour.id} className="hover:bg-cloud/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {tour.cover_image ? <Image src={tour.cover_image} alt={tour.title} className="h-full w-full" fittingType="fill" /> : null}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink">{tour.title}</p>
                          <p className="truncate text-[11.5px] text-slate-500">
                            {tour.destination} · khởi hành {tour.departure_point}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold ${tourStatusStyle(tour.status)}`}>
                        {tour.status || "Đang bán"}
                      </span>
                      {tour.is_featured ? <span className="ml-1 inline-flex rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand">Nổi bật</span> : null}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{tour.category}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">{durationLabel(tour.duration_days, tour.duration_nights)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right">
                      <p className="font-semibold text-ink tnum">{formatVND(finalPrice(tour))}</p>
                      <p className="text-[10.5px] text-slate-400 tnum">TE {formatVND(tour.price_child)} · EB {formatVND(tour.price_infant)}</p>
                    </td>
                    <td className="px-3 py-3 text-center text-[12px] text-slate-600">{tour.route?.length || 0} ngày</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to="/tours/$slug"
                          params={{ slug: tour.slug }}
                          aria-label="Xem tour"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-brand"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEdit(tour)}
                          aria-label="Sửa tour"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-brand"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDuplicate(tour)}
                          aria-label="Nhân bản tour"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-brand"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(tour)}
                          aria-label="Xóa tour"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TourEditorDialog open={dialogOpen} onOpenChange={setDialogOpen} tour={editing} onSaved={load} />

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogTitle className="font-heading text-lg font-extrabold text-ink">Xóa tour này?</AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] text-slate-600">
            Tour “{deleting?.title}” sẽ bị xóa khỏi website. Các đơn đặt tour đã ghi nhận vẫn được giữ lại.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600">Giữ lại</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="h-10 rounded-xl bg-red-600 px-4 text-[13px] font-semibold text-white hover:bg-red-700">
              Xóa tour
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}