import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authed/admin/reviews")({
  component: () => (
    <ComingSoon
      title="Đánh giá khách hàng"
      description="Duyệt đánh giá công khai, phản hồi khách và theo dõi điểm chất lượng dịch vụ."
      features={[
        "Duyệt hoặc ẩn đánh giá trước khi hiển thị",
        "Phản hồi công khai của GenTravel",
        "Điểm trung bình theo tour và theo HDV",
        "Cảnh báo đánh giá thấp cần xử lý",
      ]}
    />
  ),
});