export function formatVND(value) {
  const n = Math.round(Number(value) || 0);
  return `${n.toLocaleString("vi-VN")}₫`;
}

export function formatCompactVND(value) {
  const n = Number(value) || 0;
  if (n >= 1000000000) return `${(n / 1000000000).toFixed(1).replace(".0", "")} tỷ`;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(".0", "")} triệu`;
  return formatVND(n);
}

export function durationLabel(days, nights) {
  return `${days} ngày ${nights} đêm`;
}

export function formatDateVN(iso, withTime = false) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function finalPrice(tour) {
  const price = Number(tour?.price_adult) || 0;
  const discount = Number(tour?.discount_percent) || 0;
  return discount > 0 ? Math.round((price * (100 - discount)) / 100) : price;
}