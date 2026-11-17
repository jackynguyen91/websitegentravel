import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authed/admin/operations")({
  component: () => (
    <ComingSoon
      title="Điều hành tour"
      description="Điều phối HDV, xe và khách sạn cho từng đoàn, theo dõi checklist trước giờ khởi hành."
      features={[
        "Phân công HDV, xe, phòng khách sạn",
        "Danh sách khách và yêu cầu đặc biệt theo đoàn",
        "Checklist khởi hành và xác nhận dịch vụ",
        "Nhật ký xử lý sự cố trong tour",
      ]}
    />
  ),
});