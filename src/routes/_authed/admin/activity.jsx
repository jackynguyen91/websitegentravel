import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { History, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { ACTIVITY_MODULES, ACTIVITY_STYLE } from "@/lib/activity";
import { formatDateVN } from "@/lib/format";

export const Route = createFileRoute("/_authed/admin/activity")({
  component: AdminActivity,
});

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));

const timeOf = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });
};

function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState("all");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const load = async () => {
      const rows = await base44.entities.ActivityLog.list({ sort: "-created_date", limit: 200 });
      setLogs(asArray(rows));
      setLoading(false);
    };
    load();
  }, []);

  const visible = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return logs.filter((row) => {
      const moduleOk = module === "all" || row.module === module;
      const searchOk = !search || [row.action, row.detail, row.actor].filter(Boolean).some((value) => String(value).toLowerCase().includes(search));
      return moduleOk && searchOk;
    });
  }, [logs, module, keyword]);

  const grouped = useMemo(() => {
    const map = new Map();
    visible.forEach((row) => {
      const key = String(row.created_date || "").slice(0, 10);
      map.set(key, [...(map.get(key) || []), row]);
    });
    return [...map.entries()];
  }, [visible]);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = logs.filter((row) => String(row.created_date || "").slice(0, 10) === today).length;

  return (
    <div>
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink">Nhật ký hoạt động</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          {logs.length} bản ghi gần nhất · {todayCount} hoạt động hôm nay
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm hành động, người thực hiện, chi tiết…"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[12.5px] text-ink outline-none focus:border-brand"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[{ key: "all", label: "Tất cả" }, ...ACTIVITY_MODULES.map((item) => ({ key: item, label: item }))].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setModule(item.key)}
              className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition ${
                module === item.key ? "bg-brand text-white" : "bg-cloud text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="grid h-40 place-items-center text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <History className="h-4 w-4" /> Chưa có hoạt động nào khớp bộ lọc.
            </span>
          </div>
        ) : (
          <div className="space-y-5">
            {grouped.map(([date, rows]) => (
              <div key={date}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{formatDateVN(date)}</p>
                <div className="space-y-2">
                  {rows.map((row) => (
                    <div key={row.id} className="flex gap-3 rounded-xl border border-slate-100 px-3 py-2.5">
                      <div className="w-12 shrink-0 pt-0.5 text-[11px] font-semibold text-slate-400 tnum">{timeOf(row.created_date)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${ACTIVITY_STYLE[row.module] || ACTIVITY_STYLE["Hệ thống"]}`}>
                            {row.module}
                          </span>
                          <p className="text-[12.5px] font-semibold text-ink">{row.action}</p>
                        </div>
                        {row.detail ? <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500">{row.detail}</p> : null}
                        <p className="mt-0.5 text-[10.5px] text-slate-400">{row.actor || "Hệ thống"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}