import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, CheckCircle2, Copy, Loader2, QrCode, RefreshCw, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { getVietQrSettings, regenerateVietQrToken, saveVietQrSettings } from "@/lib/vietqr-fns";

function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</p>
        <p className="mt-0.5 break-all text-[12.5px] font-semibold text-ink">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11.5px] font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Đã sao chép" : "Sao chép"}
      </button>
    </div>
  );
}

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-ink outline-none focus:border-brand";
const labelClass = "text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500";

export default function VietQrSettingsDialog({ open, onOpenChange }) {
  const loadSettings = useServerFn(getVietQrSettings);
  const saveSettings = useServerFn(saveVietQrSettings);
  const rotateToken = useServerFn(regenerateVietQrToken);

  const [form, setForm] = useState({
    bank_id: "",
    bank_name: "",
    account_number: "",
    account_name: "",
    auto_confirm: true,
  });
  const [token, setToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("/api/vietqr-webhook");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setWebhookUrl(`${window.location.origin}/api/vietqr-webhook`);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setLoading(true);
    setError("");
    setMessage("");
    loadSettings()
      .then((setting) => {
        if (!active || !setting) return;
        setForm({
          bank_id: setting.bank_id || "",
          bank_name: setting.bank_name || "",
          account_number: setting.account_number || "",
          account_name: setting.account_name || "",
          auto_confirm: setting.auto_confirm !== false,
        });
        setToken(setting.webhook_token || "");
      })
      .catch(() => {
        if (active) setError("Chưa tải được cấu hình nhận tiền.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, loadSettings]);

  const setField = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await saveSettings({
        data: {
          bank_id: form.bank_id.trim().toUpperCase(),
          bank_name: form.bank_name.trim(),
          account_number: form.account_number.replace(/\s/g, ""),
          account_name: form.account_name.trim().toUpperCase(),
          auto_confirm: form.auto_confirm,
        },
      });
      if (saved?.webhook_token) setToken(saved.webhook_token);
      setMessage("Đã lưu cấu hình. Mã VietQR của khách sẽ dùng tài khoản này.");
    } catch {
      setError("Chưa lưu được cấu hình, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleRotate = async () => {
    setRotating(true);
    setError("");
    setMessage("");
    try {
      const saved = await rotateToken();
      if (saved?.webhook_token) setToken(saved.webhook_token);
      setMessage("Đã tạo mã bảo mật mới. Nhớ cập nhật lại mã này trên dịch vụ webhook.");
    } catch {
      setError("Chưa tạo được mã mới, vui lòng thử lại.");
    } finally {
      setRotating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
            <QrCode className="h-5 w-5" />
          </span>
          <div>
            <DialogTitle className="font-heading text-lg font-extrabold text-ink">Nhận tiền VietQR tự động</DialogTitle>
            <DialogDescription className="mt-1 text-[12.5px] leading-relaxed text-slate-600">
              Khi khách chuyển khoản đúng nội dung, hệ thống tự ghi nhận và chuyển đơn sang “Đã thanh toán”.
            </DialogDescription>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 flex items-center gap-2 text-[13px] text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Đang tải cấu hình…
          </div>
        ) : (
          <>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="vietqr-bank-id">Mã ngân hàng</label>
                <input
                  id="vietqr-bank-id"
                  className={`${inputClass} mt-1`}
                  value={form.bank_id}
                  onChange={setField("bank_id")}
                  placeholder="ACB, VCB, TCB…"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="vietqr-bank-name">Tên ngân hàng</label>
                <input
                  id="vietqr-bank-name"
                  className={`${inputClass} mt-1`}
                  value={form.bank_name}
                  onChange={setField("bank_name")}
                  placeholder="Ngân hàng Á Châu (ACB)"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="vietqr-account">Số tài khoản</label>
                <input
                  id="vietqr-account"
                  className={`${inputClass} mt-1 tnum`}
                  value={form.account_number}
                  onChange={setField("account_number")}
                  placeholder="228282868"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="vietqr-holder">Chủ tài khoản</label>
                <input
                  id="vietqr-holder"
                  className={`${inputClass} mt-1`}
                  value={form.account_name}
                  onChange={setField("account_name")}
                  placeholder="G MEDIA TECH CO., LTD"
                />
              </div>
            </div>

            <div className="mt-4 flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-cloud px-3 py-3">
              <div>
                <p className="text-[13px] font-semibold text-ink">Tự động xác nhận thanh toán</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500">
                  Bật: giao dịch khớp mã đơn được ghi nhận ngay. Tắt: giao dịch vào sổ ở trạng thái “Chờ xử lý” để kế
                  toán tự đối soát.
                </p>
              </div>
              <Switch
                checked={form.auto_confirm}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, auto_confirm: checked }))}
                aria-label="Tự động xác nhận thanh toán"
              />
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 p-3">
              <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
                <ShieldCheck className="h-4 w-4 text-brand" /> Kết nối dịch vụ báo giao dịch
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
                Ngân hàng không tự gọi vào ứng dụng, nên cần một dịch vụ đọc biến động số dư (Casso, SePay, payOS…). Tạo
                webhook trỏ tới địa chỉ dưới đây và đặt mã bảo mật ở phần xác thực.
              </p>
              <div className="mt-2 space-y-2">
                <CopyRow label="Địa chỉ webhook" value={webhookUrl} />
                <CopyRow label="Mã bảo mật (Bearer / Apikey)" value={token} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRotate}
                  disabled={rotating}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[12px] font-semibold text-slate-600 hover:bg-cloud disabled:opacity-60"
                >
                  {rotating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  Tạo mã mới
                </button>
                <span className="text-[11px] text-slate-400">Nội dung chuyển khoản phải có mã đơn, ví dụ BK-1024.</span>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">
                {error}
              </p>
            )}
            {message && (
              <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[12.5px] font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {message}
              </p>
            )}
          </>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-semibold text-white disabled:opacity-70"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Đang lưu…" : "Lưu cấu hình"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}