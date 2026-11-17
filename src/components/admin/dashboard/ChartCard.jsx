import { useRef, useState } from "react";
import { Check, Download, FileImage } from "lucide-react";
import { exportCsv, exportNodeAsPng } from "@/lib/admin/export";

export default function ChartCard({
  title,
  subtitle,
  actions,
  children,
  csvRows,
  csvColumns,
  filename = "gentravel-bao-cao",
  className = "",
}) {
  const nodeRef = useRef(null);
  const [saved, setSaved] = useState("");

  const flash = (key) => {
    setSaved(key);
    setTimeout(() => setSaved(""), 1600);
  };

  const handleCsv = () => {
    if (!csvRows || !csvColumns) return;
    exportCsv(csvRows, filename, csvColumns);
    flash("csv");
  };

  const handlePng = async () => {
    await exportNodeAsPng(nodeRef.current, filename);
    flash("png");
  };

  return (
    <section ref={nodeRef} className={`rounded-xl border border-slate-200/80 bg-admin-card p-4 shadow-sm sm:p-5 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-[13.5px] font-semibold text-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11.5px] text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1">
          {actions}
          {csvRows && (
            <button
              type="button"
              onClick={handleCsv}
              title="Xuất CSV"
              className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 px-1.5 text-[10.5px] font-medium text-slate-500 transition hover:text-ink"
            >
              {saved === "csv" ? <Check className="h-3 w-3 text-state-success" /> : <Download className="h-3 w-3" />}
              CSV
            </button>
          )}
          <button
            type="button"
            onClick={handlePng}
            title="Xuất PNG"
            className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 px-1.5 text-[10.5px] font-medium text-slate-500 transition hover:text-ink"
          >
            {saved === "png" ? <Check className="h-3 w-3 text-state-success" /> : <FileImage className="h-3 w-3" />}
            PNG
          </button>
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}