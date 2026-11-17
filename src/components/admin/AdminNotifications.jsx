import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Bell, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getDashboard } from "@/lib/admin-fns";
import { cn } from "@/lib/utils";

export default function AdminNotifications() {
  const fetchDashboard = useServerFn(getDashboard);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen || alerts.length) return;
    setLoading(true);
    try {
      const data = await fetchDashboard({ data: { range: "30d" } });
      setAlerts(data.alerts || []);
    } finally {
      setLoading(false);
    }
  };

  const total = alerts.reduce((sum, item) => sum + item.count, 0);

  return (
    <Popover open={open} onOpenChange={load}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Thông báo"
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:text-ink"
        >
          <Bell className="h-4 w-4" />
          {total > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-state-danger px-1 text-[10px] font-bold text-white">
              {total > 99 ? "99+" : total}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[320px] p-0">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-[13px] font-semibold text-ink">Thông báo vận hành</p>
          <p className="text-[11.5px] text-slate-500">Cập nhật từ dữ liệu 30 ngày gần nhất</p>
        </div>
        <div className="max-h-[320px] overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-[12.5px] text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Đang tải…
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center gap-1 py-6 text-center text-[12.5px] text-slate-500">
              <CheckCircle2 className="h-5 w-5 text-state-success" />
              Chưa có cảnh báo nào
            </div>
          ) : (
            alerts.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate({ to: item.to });
                }}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50"
              >
                <AlertTriangle
                  className={cn(
                    "h-4 w-4 shrink-0",
                    item.tone === "danger" && "text-state-danger",
                    item.tone === "warning" && "text-state-warning",
                    item.tone === "info" && "text-state-info",
                    item.tone === "neutral" && "text-slate-400",
                  )}
                />
                <span className="min-w-0 flex-1 text-[12.5px] leading-snug text-slate-600">{item.label}</span>
                <span className="text-[12.5px] font-semibold text-ink tnum">{item.count}</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}