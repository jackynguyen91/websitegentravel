import { useEffect, useState } from "react";
import { Loader2, Plus, Receipt, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { area, field, labelText } from "@/components/admin/tours/form-parts";
import { tourFinance } from "@/lib/tour-profit";
import { formatVND } from "@/lib/format";

const CATEGORIES = ["Khách sạn", "Nhà xe", "Nhà hàng", "Hướng dẫn viên", "Vé tham quan", "Khác"];
const emptyLine = () => ({ partner_id: "", category: "Khách sạn", amount: 0, basis: "Toàn tour", quantity: 1, note: "" });

export default function TourCostDialog({ open, onOpenChange, tour, partners, bookings, costs, onSaved }) {
  const [line, setLine] = useState(emptyLine());
  const [saving, setSaving] = useState(false);
  const tourCosts = costs.filter((row) => row.tour_id === tour?.id);
  const finance = tour ? tourFinance(tour, bookings, costs) : null;

  useEffect(() => {
    if (!open) return;
    setLine(emptyLine());
  }, [open, tour]);

  if (!tour) return null;

  const set = (key, value) => setLine((prev) => ({ ...prev, [key]: value }));

  const handleAdd = async () => {
    if (!(Number(line.amount) > 0)) return;
    setSaving(true);
    try {
      const partner = partners.find((item) => item.id === line.partner_id);
      await base44.entities.TourCost.create({
        tour_id: tour.id,
        tour_title: tour.title,
        partner_id: line.partner_id,
        partner_name: partner?.name || "",
        category: line.category,
        amount: Number(line.amount) || 0,
        basis: line.basis,
        quantity: Number(line.quantity) || 1,
        note: line.note.trim(),
      });
      setLine(emptyLine());
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cost) => {
    await base44.entities.TourCost.delete(cost.id);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto">
        <DialogTitle className="font-heading text-lg font-extrabold text-ink">Chi phí tour</DialogTitle>
        <DialogDescription className="text-[12.5px] text-slate-500">{tour.title}</DialogDescription>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Doanh thu", value: formatVND(finance.revenue) },
            { label: "Chi phí", value: formatVND(finance.cost) },
            { label: "Lợi nhuận gộp", value: formatVND(finance.profit) },
            { label: "Biên LN", value: `${finance.margin.toFixed(1)}%` },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-cloud px-2.5 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-500">{item.label}</p>
              <p className={`mt-0.5 text-[12.5px] font-bold tnum ${item.label === "Lợi nhuận gộp" && finance.profit < 0 ? "text-red-600" : "text-ink"}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {tourCosts.length === 0 && (
            <p className="rounded-lg bg-cloud px-3 py-4 text-center text-[12.5px] text-slate-500">
              <Receipt className="mx-auto mb-1 h-4 w-4 text-slate-400" />
              Chưa ghi nhận chi phí nào cho tour này.
            </p>
          )}
          {tourCosts.map((cost) => (
            <div key={cost.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-semibold text-ink">
                  {cost.category}
                  {cost.partner_name ? ` · ${cost.partner_name}` : ""}
                </p>
                <p className="text-[11px] text-slate-500">
                  {formatVND(cost.amount)} × {Number(cost.quantity) || 1} · {cost.basis}
                  {cost.note ? ` · ${cost.note}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(cost)}
                aria-label="Xóa chi phí"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 p-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Thêm chi phí</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div>
              <label className={labelText}>Đối tác</label>
              <select className={field} value={line.partner_id} onChange={(e) => {
                const partner = partners.find((item) => item.id === e.target.value);
                set("partner_id", e.target.value);
                if (partner) set("category", partner.type === "Hướng dẫn viên" ? "Hướng dẫn viên" : partner.type);
              }}>
                <option value="">Không chọn đối tác</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelText}>Loại chi phí</label>
              <select className={field} value={line.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelText}>Đơn giá (VND)</label>
              <input type="number" min={0} className={field} value={line.amount} onChange={(e) => set("amount", e.target.value)} />
            </div>
            <div>
              <label className={labelText}>Cách tính</label>
              <select className={field} value={line.basis} onChange={(e) => set("basis", e.target.value)}>
                <option>Toàn tour</option>
                <option>Mỗi khách</option>
              </select>
            </div>
            <div>
              <label className={labelText}>Số lượng (đêm / suất)</label>
              <input type="number" min={1} className={field} value={line.quantity} onChange={(e) => set("quantity", e.target.value)} />
            </div>
            <div>
              <label className={labelText}>Ghi chú</label>
              <input className={field} value={line.note} onChange={(e) => set("note", e.target.value)} placeholder="2 đêm phòng deluxe" />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={saving || !(Number(line.amount) > 0)}
            className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-[12px] font-semibold text-white disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Ghi nhận chi phí
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <button type="button" onClick={() => onOpenChange(false)} className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600">
            Đóng
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}