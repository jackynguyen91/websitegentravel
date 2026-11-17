import { useEffect, useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { base44 } from "@/api/base44Client";
import { sendWeeklyReport } from "@/lib/report-fns";
import { logActivity } from "@/lib/activity";
import { useAuth } from "@/lib/AuthContext";
import { area, field, labelText } from "@/components/admin/tours/form-parts";

const WEEKDAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));

export default function WeeklyReportCard() {
  const { user } = useAuth();
  const send = useServerFn(sendWeeklyReport);
  const [record, setRecord] = useState(null);
  const [emails, setEmails] = useState("");
  const [weekday, setWeekday] = useState("Thứ 2");
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const rows = asArray(await base44.entities.ReportSetting.list({ limit: 1 }));
      const settings = rows[0] || null;
      setRecord(settings);
      setEmails((settings?.recipients || []).join(", "));
      setWeekday(settings?.weekday || "Thứ 2");
      setEnabled(settings?.enabled ?? true);
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage("");
    const payload = {
      recipients: emails
        .split(/[,;\s]+/)
        .map((value) => value.trim())
        .filter((value) => value.includes("@")),
      weekday,
      enabled,
    };
    if (record) await base44.entities.ReportSetting.update(record.id, payload);
    else {
      const created = await base44.entities.ReportSetting.create(payload);
      setRecord(created);
    }
    setSaving(false);
    setMessage("Đã lưu lịch gửi báo cáo.");
  };

  const sendNow = async () => {
    setSending(true);
    setMessage("");
    try {
      const result = await send();
      if (result?.error) setMessage(result.error);
      else {
        setMessage(`Đã gửi báo cáo tuần tới ${result.recipients} email.`);
        await logActivity({
          module: "Báo cáo",
          action: "Gửi báo cáo tuần thủ công",
          detail: `${result.recipients} email · ${result.from} → ${result.to}`,
          actor: user?.full_name || user?.email || "",
        });
      }
    } catch {
      setMessage("Chưa gửi được báo cáo. Vui lòng kiểm tra lại email nhận.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-brand" />
        <h3 className="text-[13px] font-bold text-ink">Báo cáo tuần tự động</h3>
      </div>
      <p className="mt-1 text-[11.5px] text-slate-500">Tổng hợp doanh thu, lợi nhuận, tỷ lệ hủy và top tour gửi cho ban lãnh đạo.</p>

      <div className="mt-3 space-y-2">
        <div>
          <label className={labelText}>Email nhận báo cáo (cách nhau bằng dấu phẩy)</label>
          <textarea rows={2} className={area} value={emails} onChange={(e) => setEmails(e.target.value)} placeholder="giamdoc@gientravel.vn, ketoan@gientravel.vn" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelText}>Ngày gửi</label>
            <select className={field} value={weekday} onChange={(e) => setWeekday(e.target.value)}>
              {WEEKDAYS.map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
          </div>
          <label className="flex items-end gap-2 pb-2 text-[12.5px] font-medium text-slate-600">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand" />
            Bật gửi tự động
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={save} disabled={saving} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[12px] font-semibold text-slate-600 hover:text-brand disabled:opacity-60">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Lưu lịch gửi
          </button>
          <button type="button" onClick={sendNow} disabled={sending} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-[12px] font-semibold text-white disabled:opacity-60">
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Gửi báo cáo tuần
          </button>
        </div>
        {message ? <p className="rounded-lg bg-cloud px-3 py-2 text-[11.5px] font-medium text-slate-600">{message}</p> : null}
        <p className="text-[10.5px] text-slate-400">
          Bấm “Gửi báo cáo tuần” để gửi ngay. Để gửi tự động vào {weekday} hằng tuần, cần đặt lịch trong Workflows của Base44.
        </p>
      </div>
    </div>
  );
}