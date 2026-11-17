import { formatDateVN } from "@/lib/format";

const STAFF_ROLES = ["Quản lý", "Kinh doanh", "Điều hành", "Kế toán", "Marketing"];
const ROLE_STYLE = {
  "Quản lý": "border-purple-200 bg-purple-50 text-purple-700",
  "Kinh doanh": "border-sky-200 bg-sky-50 text-sky-700",
  "Điều hành": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Kế toán": "border-amber-200 bg-amber-50 text-amber-700",
  "Marketing": "border-pink-200 bg-pink-50 text-pink-700",
};

export default function StaffTable({ items, loading, onUpdate }) {
  if (loading) {
    return (
      <div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-11 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="grid h-40 place-items-center rounded-2xl border border-slate-100 bg-white text-sm text-slate-500 shadow-card">Chưa có nhân sự nào.</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead className="bg-cloud text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Nhân sự</th>
              <th className="px-3 py-3 font-semibold">Quyền hệ thống</th>
              <th className="px-3 py-3 font-semibold">Vai trò nội bộ</th>
              <th className="px-3 py-3 font-semibold">Trạng thái</th>
              <th className="px-3 py-3 font-semibold">Tham gia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((member) => (
              <tr key={member.id} className="hover:bg-cloud/60">
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{member.full_name || member.email?.split("@")[0]}</p>
                  <p className="text-[11.5px] text-slate-500">{member.email}</p>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold ${
                      member.role === "admin" ? "border-brand/30 bg-brand-50 text-brand" : "border-slate-200 bg-slate-100 text-slate-600"
                    }`}
                  >
                    {member.role === "admin" ? "Quản trị" : "Nhân viên"}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={member.staff_role || "Kinh doanh"}
                    onChange={(e) => onUpdate(member, { staff_role: e.target.value })}
                    className={`h-8 rounded-lg border px-2 text-[12px] font-semibold ${ROLE_STYLE[member.staff_role] || ROLE_STYLE["Kinh doanh"]}`}
                  >
                    {STAFF_ROLES.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={member.staff_status || "Đang làm việc"}
                    onChange={(e) => onUpdate(member, { staff_status: e.target.value })}
                    className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-[12px] text-slate-600"
                  >
                    <option>Đang làm việc</option>
                    <option>Tạm nghỉ</option>
                  </select>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-slate-500">{formatDateVN(member.created_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}