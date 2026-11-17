// Điểm khởi hành dùng cho bộ chọn trên thanh menu.
export const DEFAULT_DEPARTURE = "TP. Hồ Chí Minh";
export const ALL_DEPARTURES = "Tất cả";

export const DEPARTURE_OPTIONS = ["TP. Hồ Chí Minh", "Hà Nội", "Khác"];

const STORAGE_KEY = "gentravel_departure_point";

export function normalizeDeparture(value) {
  const text = String(value || "")
    .toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "Khác";
  if (text.includes("hồ chí minh") || text.includes("ho chi minh") || text.includes("hcm") || text.includes("sài gòn") || text.includes("sai gon")) {
    return "TP. Hồ Chí Minh";
  }
  if (text.includes("hà nội") || text.includes("ha noi")) return "Hà Nội";
  return "Khác";
}

export function matchesDeparture(departurePoint, selected) {
  if (!selected || selected === ALL_DEPARTURES) return true;
  return normalizeDeparture(departurePoint) === normalizeDeparture(selected);
}

export function readDeparturePoint() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return [ALL_DEPARTURES, ...DEPARTURE_OPTIONS].includes(stored) ? stored : DEFAULT_DEPARTURE;
  } catch {
    return DEFAULT_DEPARTURE;
  }
}

export function saveDeparturePoint(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // trình duyệt chặn lưu trữ: vẫn giữ lựa chọn trong phiên hiện tại
  }
}