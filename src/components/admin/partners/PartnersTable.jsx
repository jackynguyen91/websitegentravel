import { Pencil, Star, Trash2 } from "lucide-react";

const TYPE_STYLE = {
  "Khách sạn": "border-purple-200 bg-purple-50 text-purple-700",
  "Nhà xe": "border-sky-200 bg-sky-50 text-sky-700",
  "Nhà hàng": "border-amber-200 bg-amber-50 text-amber-700",
  "Hướng dẫn viên": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Hãng bay": "border-pink-200 bg-pink-50 text-pink-700",
  "Khác": "border-slate-200 bg-slate-100 text-slate-600",
};

const STATUS_STYLE = {
  "Đang hợp tác": "text-emerald-700",
  "Tạm dừng": "text-amber-600",
  "Ngừng hợp tác": "text-slate-400",
};

export default function PartnersTable({ items, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-11 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="grid h-40 place-items-center rounded-2xl border border-slate-100 bg-white text-sm text-slate-500 shadow-card">Chưa có đối tác nào.</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead className="bg-cloud text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Đối tác</th>
              <th className="px-3 py-3 font-semibold">Loại</th>
              <th className="px-3 py-3 font-semibold">Liên hệ</th>
              <th className="px-3 py-3 font-semibold">Khu vực</th>
              <th className="px-3 py-3 font-semibold">Đánh giá</th>
              <th className="px-3 py-3 font-semibold">Trạng thái</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((partner) => (
              <tr key={partner.id} className="hover:bg-cloud/60">
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{partner.name}</p>
                  <p className="truncate text-[11.5px] text-slate-500">{partner.address || "—"}</p>
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold ${TYPE_STYLE[partner.type] || TYPE_STYLE["Khác"]}`}>
                    {partner.type}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <p className="text-slate-700">{partner.contact_person || "—"}</p>
                  <p className="text-[11.5px] text-slate-500">{partner.phone || partner.email || "—"}</p>
                </td>
                <td className="px-3 py-3 text-slate-600">{partner.city || "—"}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink tnum">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {Number(partner.rating) || 0}
                  </span>
                </td>
                <td className={`px-3 py-3 text-[12px] font-semibold ${STATUS_STYLE[partner.status] || "text-slate-500"}`}>{partner.status}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(partner)}
                      aria-label="Sửa đối tác"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-brand"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(partner)}
                      aria-label="Xóa đối tác"
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
    </div>
  );
}