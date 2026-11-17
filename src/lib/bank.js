// Thông tin nhận thanh toán của GenTravel (dùng để tạo mã VietQR).
export const BANK = {
  id: "ACB",
  name: "Ngân hàng Á Châu (ACB)",
  accountNumber: "228282868",
  accountName: "G MEDIA TECH CO., LTD",
  template: "compact2",
};

export const transferContent = (booking) =>
  `${booking?.booking_code || ""} ${booking?.customer_phone || ""}`.trim();

export function buildVietQRUrl(booking, bank = BANK) {
  const amount = Math.round(Number(booking?.total_price) || 0);
  const query = [
    `amount=${amount}`,
    `addInfo=${encodeURIComponent(transferContent(booking))}`,
    `accountName=${encodeURIComponent(bank.accountName)}`,
  ].join("&");
  return `https://img.vietqr.io/image/${bank.id}-${bank.accountNumber}-${bank.template || BANK.template}.svg?${query}`;
}