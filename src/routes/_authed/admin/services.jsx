import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ServiceFormDialog from "@/components/admin/ServiceFormDialog";
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
import { formatVND } from "@/lib/format";

export const Route = createFileRoute("/_authed/admin/services")({
  component: AdminServices,
});

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));

function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    const rows = await base44.entities.Service.list({ sort: "-created_date", limit: 100 });
    setServices(asArray(rows));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    if (!deleting) return;
    await base44.entities.Service.delete(deleting.id);
    setDeleting(null);
    await load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink">Dịch vụ khác</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Vé máy bay, vé tham quan, khách sạn và visa hiển thị trên website.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Thêm dịch vụ
        </button>
      </div>

      {loading ? (
        <div className="mt-5 grid h-40 place-items-center rounded-2xl border border-slate-100 bg-white text-sm text-slate-400">
          Đang tải dịch vụ…
        </div>
      ) : services.length === 0 ? (
        <div className="mt-5 grid h-40 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white text-sm text-slate-500">
          Chưa có dịch vụ nào.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card"
            >
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {service.image ? (
                  <Image src={service.image} alt={service.title} className="h-full w-full" fittingType="fill" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand">{service.type}</span>
                  <span className={`rounded-full px-2 py-0.5 ${service.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {service.is_active ? "Đang hiển thị" : "Đang ẩn"}
                  </span>
                </div>
                <h2 className="mt-1 truncate font-heading text-[15px] font-bold text-ink">{service.title}</h2>
                <p className="mt-0.5 line-clamp-1 text-[12.5px] text-slate-500">
                  {Number(service.price_from) > 0
                    ? `${formatVND(service.price_from)}${service.price_unit ? `/${service.price_unit}` : ""}`
                    : "Giá theo yêu cầu"}
                  {service.price_note ? ` · ${service.price_note}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  to="/dich-vu-khac"
                  search={{ type: service.type }}
                  className="hidden h-8 items-center rounded-lg border border-slate-200 px-3 text-[12px] font-semibold text-slate-500 hover:text-brand sm:inline-flex"
                >
                  Xem
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(service);
                    setDialogOpen(true);
                  }}
                  aria-label="Sửa dịch vụ"
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-brand"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(service)}
                  aria-label="Xóa dịch vụ"
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ServiceFormDialog open={dialogOpen} onOpenChange={setDialogOpen} service={editing} onSaved={load} />

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogTitle className="font-heading text-lg font-extrabold text-ink">Xóa dịch vụ này?</AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] text-slate-600">
            Dịch vụ “{deleting?.title}” sẽ không còn hiển thị trong mục Dịch vụ khác.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600">
              Giữ lại
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="h-10 rounded-xl bg-red-600 px-4 text-[13px] font-semibold text-white hover:bg-red-700"
            >
              Xóa dịch vụ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}