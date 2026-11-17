import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { field, labelText } from "@/components/admin/tours/form-parts";
import { logActivity } from "@/lib/activity";

const STAFF_ROLES = ["Quản lý", "Kinh doanh", "Điều hành", "Kế toán", "Marketing"];

export default function InviteStaffDialog({ open, onOpenChange, onInvited }) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [platformRole, setPlatformRole] = useState("user");
  const [staffRole, setStaffRole] = useState("Kinh doanh");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setEmail("");
    setPlatformRole("user");
    setStaffRole("Kinh doanh");
    setMessage("");
    setError("");
  }, [open]);

  const handleInvite = async () => {
    if (!email.includes("@")) {
      setError("Vui lòng nhập email hợp lệ.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await base44.users.inviteUser(email.trim(), platformRole);
      const rows = await base44.entities.User.filter({ email: email.trim() });
      const invited = (Array.isArray(rows) ? rows : rows?.items ?? [])[0];
      if (invited?.id) await base44.entities.User.update(invited.id, { staff_role: staffRole });
      await logActivity({
        module: "Nhân sự",
        action: "Mời nhân sự",
        detail: `${email.trim()} · ${platformRole} · ${staffRole}`,
        actor: user?.full_name || user?.email || "",
      });
      setMessage(`Đã gửi lời mời tới ${email.trim()}.`);
      onInvited();
    } catch {
      setError("Chưa gửi được lời mời. Kiểm tra email hoặc quyền quản trị của bạn.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle className="font-heading text-lg font-extrabold text-ink">Mời nhân sự</DialogTitle>
        <DialogDescription className="text-[12.5px] text-slate-500">
          Người được mời sẽ nhận email kích hoạt và đăng nhập bằng tài khoản Base44.
        </DialogDescription>

        <div className="mt-4 space-y-3">
          <div>
            <label className={labelText}>Email nhân sự</label>
            <input className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nhanvien@gientravel.vn" />
          </div>
          <div>
            <label className={labelText}>Quyền hệ thống</label>
            <select className={field} value={platformRole} onChange={(e) => setPlatformRole(e.target.value)}>
              <option value="user">Nhân viên (không vào trang quản trị)</option>
              <option value="admin">Quản trị (toàn quyền)</option>
            </select>
          </div>
          <div>
            <label className={labelText}>Vai trò nội bộ</label>
            <select className={field} value={staffRole} onChange={(e) => setStaffRole(e.target.value)}>
              {STAFF_ROLES.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">{error}</p> : null}
        {message ? <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[12.5px] font-medium text-emerald-700">{message}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => onOpenChange(false)} className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600">
            Đóng
          </button>
          <button
            type="button"
            onClick={handleInvite}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-[13px] font-semibold text-white disabled:opacity-70"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Gửi lời mời
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}