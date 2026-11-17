const STYLES = {
  Paid: { label: "Đã thanh toán", className: "bg-state-success/10 text-state-success" },
  "Pending Verification": { label: "Chờ xác nhận TT", className: "bg-state-info/10 text-state-info" },
  Unpaid: { label: "Chưa thanh toán", className: "bg-state-warning/10 text-state-warning" },
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || STYLES.Unpaid;
  return (
    <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${style.className}`}>
      {style.label}
    </span>
  );
}