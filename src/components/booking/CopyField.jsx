import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyField({ label, value, display, emphasize = false }) {
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
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</p>
        <p
          className={`truncate text-[13px] ${
            emphasize ? "font-heading font-extrabold text-cta" : "font-semibold text-ink"
          }`}
        >
          {display ?? value}
        </p>
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