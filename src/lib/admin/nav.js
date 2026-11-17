import {
  BarChart3,
  BadgePercent,
  CalendarCheck,
  CalendarRange,
  ClipboardList,
  CreditCard,
  FileText,
  Handshake,
  History,
  LayoutDashboard,
  MapPinned,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Ticket,
  Undo2,
  Users,
} from "lucide-react";

export const ADMIN_NAV = [
  {
    label: "Tổng quan",
    items: [
      { to: "/admin", label: "Dashboard điều hành", icon: LayoutDashboard, exact: true, ready: true },
      { to: "/admin/reports", label: "Báo cáo & phân tích", icon: BarChart3 },
    ],
  },
  {
    label: "Bán hàng",
    items: [
      { to: "/admin/bookings", label: "Đơn đặt tour", icon: CalendarCheck, ready: true },
      { to: "/admin/customers", label: "Khách hàng (CRM)", icon: Users },
      { to: "/admin/payments", label: "Thanh toán & công nợ", icon: CreditCard },
      { to: "/admin/promotions", label: "Khuyến mãi & voucher", icon: BadgePercent },
    ],
  },
  {
    label: "Sản phẩm",
    items: [
      { to: "/admin/tours", label: "Quản lý tour", icon: MapPinned, ready: true },
      { to: "/admin/departures", label: "Lịch khởi hành & chỗ trống", icon: CalendarRange },
      { to: "/admin/services", label: "Dịch vụ khác", icon: Ticket, ready: true },
      { to: "/admin/partners", label: "Đối tác & nhà cung cấp", icon: Handshake },
    ],
  },
  {
    label: "Vận hành",
    items: [
      { to: "/admin/operations", label: "Điều hành tour", icon: ClipboardList },
      { to: "/admin/refunds", label: "Hủy & hoàn tiền", icon: Undo2 },
    ],
  },
  {
    label: "Marketing",
    items: [
      { to: "/admin/blog", label: "Bài viết", icon: FileText, ready: true },
      { to: "/admin/reviews", label: "Đánh giá khách hàng", icon: Star },
      { to: "/admin/seo", label: "SEO & banner", icon: Search },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { to: "/admin/staff", label: "Nhân sự & phân quyền", icon: ShieldCheck },
      { to: "/admin/settings", label: "Cài đặt", icon: Settings },
      { to: "/admin/activity", label: "Nhật ký hoạt động", icon: History },
    ],
  },
];

export const ADMIN_NAV_FLAT = ADMIN_NAV.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label })));

export const RANGE_OPTIONS = [
  { value: "today", label: "Hôm nay" },
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "month", label: "Tháng này" },
  { value: "quarter", label: "Quý này" },
  { value: "year", label: "Năm nay" },
  { value: "custom", label: "Tùy chọn" },
];