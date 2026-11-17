import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authed/admin/settings")({
  component: () => (
    <ComingSoon
      title="Cài đặt hệ thống"
      description="Thông tin công ty, mẫu email, tài khoản ngân hàng và các thiết lập thông báo vận hành."
      features={[
        "Thông tin pháp lý và thương hiệu GenTravel",
        "Tài khoản nhận thanh toán VietQR",
        "Mẫu email xác nhận và nhắc thanh toán",
        "Ngưỡng cảnh báo đơn và chỗ trống",
      ]}
    />
  ),
});