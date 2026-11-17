export const TOUR_STATUSES = ["Nháp", "Đang bán", "Tạm dừng", "Hết chỗ"];

export const TOUR_STATUS_STYLE = {
  "Nháp": "border-slate-200 bg-slate-100 text-slate-600",
  "Đang bán": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Tạm dừng": "border-amber-200 bg-amber-50 text-amber-700",
  "Hết chỗ": "border-red-200 bg-red-50 text-red-700",
};

export const tourStatusStyle = (status) => TOUR_STATUS_STYLE[status] || TOUR_STATUS_STYLE["Nháp"];

export const isTourOnSale = (tour) => (tour?.status || "Đang bán") === "Đang bán";