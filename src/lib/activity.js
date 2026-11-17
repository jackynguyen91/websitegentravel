import { base44 } from "@/api/base44Client";

/** Ghi nhật ký hoạt động; lỗi ghi log không được làm hỏng thao tác chính. */
export async function logActivity({ module, action, detail = "", entity_id = "", actor = "" }) {
  try {
    await base44.entities.ActivityLog.create({ module, action, detail, entity_id, actor });
  } catch {
    // bỏ qua
  }
}

export const ACTIVITY_MODULES = ["Đơn hàng", "Thanh toán", "Tour", "Đối tác", "Nhân sự", "Báo cáo", "Hệ thống"];

export const ACTIVITY_STYLE = {
  "Đơn hàng": "border-sky-200 bg-sky-50 text-sky-700",
  "Thanh toán": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Tour": "border-purple-200 bg-purple-50 text-purple-700",
  "Đối tác": "border-amber-200 bg-amber-50 text-amber-700",
  "Nhân sự": "border-pink-200 bg-pink-50 text-pink-700",
  "Báo cáo": "border-slate-200 bg-slate-100 text-slate-600",
  "Hệ thống": "border-slate-200 bg-slate-100 text-slate-600",
};