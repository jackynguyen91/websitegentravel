export default function StatCard({ label, value, hint, icon: Icon, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-50 text-brand",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-sky-50 text-sky-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
          <p className="mt-2 font-heading text-2xl font-extrabold leading-tight text-ink">{value}</p>
          {hint && <p className="mt-1 text-[12px] text-slate-500">{hint}</p>}
        </div>
        {Icon && (
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tones[tone] || tones.brand}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}