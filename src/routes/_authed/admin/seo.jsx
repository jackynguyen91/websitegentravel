import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authed/admin/seo")({
  component: () => (
    <ComingSoon
      title="SEO & banner"
      description="Quản lý thẻ meta, banner trang chủ và nội dung quảng bá cho từng chiến dịch."
      features={[
        "Tiêu đề và mô tả SEO cho tour, bài viết",
        "Quản lý banner trang chủ theo lịch",
        "Kiểm tra liên kết hỏng và từ khóa",
        "Theo dõi thứ hạng tìm kiếm",
      ]}
    />
  ),
});