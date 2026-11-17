import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authed/admin/promotions")({
  component: () => (
    <ComingSoon
      title="Khuyến mãi & voucher"
      description="Tạo mã giảm giá, chiến dịch theo mùa và theo dõi hiệu quả từng chương trình."
      features={[
        "Mã giảm giá theo % hoặc số tiền, giới hạn lượt dùng",
        "Áp dụng theo tour, điểm đến hoặc kênh bán",
        "Theo dõi doanh thu và chi phí khuyến mãi",
        "Lịch chạy chiến dịch tự động",
      ]}
    />
  ),
});