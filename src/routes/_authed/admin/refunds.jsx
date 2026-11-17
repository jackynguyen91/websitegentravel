import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authed/admin/refunds")({
  component: () => (
    <ComingSoon
      title="Hủy & hoàn tiền"
      description="Quy trình duyệt hủy tour và hoàn tiền minh bạch, có lý do và người phê duyệt."
      features={[
        "Tiếp nhận yêu cầu hủy từ khách và đại lý",
        "Tính mức hoàn theo chính sách từng tour",
        "Phê duyệt nhiều cấp, ghi nhận người duyệt",
        "Theo dõi trạng thái hoàn tiền",
      ]}
    />
  ),
});