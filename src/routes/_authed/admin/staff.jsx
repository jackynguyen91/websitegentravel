import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, UserPlus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import StaffTable from "@/components/admin/staff/StaffTable";
import InviteStaffDialog from "@/components/admin/staff/InviteStaffDialog";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/_authed/admin/staff")({
  component: AdminStaff,
});

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));

const PERMISSIONS = [
  { role: "Quản lý", scope: "Toàn bộ dashboard, báo cáo, duyệt chi và phân quyền" },
  { role: "Kinh doanh", scope: "Đơn đặt tour, khách hàng, ghi nhận thu tiền, xem tour" },
  { role: "Điều hành", scope: "Lịch khởi hành, chỗ trống, phân công HDV và xe" },
  { role: "Kế toán", scope: "Thanh toán, công nợ, đối soát, chi trả đối tác" },
  { role: "Marketing", scope: "Bài viết, SEO, đánh giá, báo cáo kênh bán" },
];

function AdminStaff() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [inviteOpen, setInviteOpen] = useState(false);

  const load = async () => {
    try {
      const rows = await base44.entities.User.list();
      setMembers(asArray(rows));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return members.filter((member) => {
      const roleOk = roleFilter === "all" || (member.staff_role || "Kinh doanh") === roleFilter;
      const searchOk = !search || [member.full_name, member.email].filter(Boolean).some((value) => String(value).toLowerCase().includes(search));
      return roleOk && searchOk;
    });
  }, [members, keyword, roleFilter]);

  const stats = useMemo(
    () => ({
      total: members.length,
      admins: members.filter((member) => member.role === "admin").length,
      active: members.filter((member) => (member.staff_status || "Đang làm việc") === "Đang làm việc").length,
    }),
    [members],
  );

  const handleUpdate = async (member, patch) => {
    await base44.entities.User.update(member.id, patch);
    if (patch.staff_role) {
      await logActivity({
        module: "Nhân sự",
        action: "Đổi vai trò nội bộ",
        detail: `${member.email} → ${patch.staff_role}`,
        entity_id: member.id,
        actor: user?.full_name || user?.email || "",
      });
    }
    await load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink">Nhân sự & phân quyền</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            {stats.total} tài khoản · {stats.admins} quản trị · {stats.active} đang làm việc
          </p>
        </div>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-semibold text-white"
        >
          <UserPlus className="h-4 w-4" /> Mời nhân sự
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm nhân sự theo tên hoặc email…"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[12.5px] text-ink outline-none focus:border-brand"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[{ key: "all", label: "Tất cả" }, ...PERMISSIONS.map((item) => ({ key: item.role, label: item.role }))].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setRoleFilter(item.key)}
              className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition ${
                roleFilter === item.key ? "bg-brand text-white" : "bg-cloud text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <StaffTable items={visible} loading={loading} onUpdate={handleUpdate} />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <h3 className="text-[13px] font-bold text-ink">Ma trận phân quyền nội bộ</h3>
        <p className="mt-1 text-[11.5px] text-slate-500">
          Vai trò nội bộ định hướng công việc từng người. Quyền truy cập trang quản trị do quyền hệ thống quyết định: chỉ tài khoản Quản trị mới vào được toàn bộ dashboard.
        </p>
        <div className="mt-3 divide-y divide-slate-100">
          {PERMISSIONS.map((row) => (
            <div key={row.role} className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[12.5px] font-semibold text-ink">{row.role}</span>
              <span className="text-[12px] text-slate-500 sm:text-right">{row.scope}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11.5px] text-amber-800">
          Lưu ý: tài khoản Quản trị xem và sửa được toàn bộ dữ liệu, kể cả doanh thu và thông tin khách. Chỉ cấp quyền này cho người thật sự cần.
        </p>
      </div>

      <InviteStaffDialog open={inviteOpen} onOpenChange={setInviteOpen} onInvited={load} />
    </div>
  );
}