export const field =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-ink outline-none transition focus:border-brand";
export const labelText = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500";
export const area =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] leading-relaxed text-ink outline-none focus:border-brand";
export const ghostButton =
  "inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[12px] font-semibold text-slate-600 transition hover:border-brand hover:text-brand";

export function Section({ title, hint, children }) {
  return (
    <section className="rounded-xl border border-slate-100 bg-white p-4">
      <h4 className="text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">{title}</h4>
      {hint ? <p className="mt-1 text-[11.5px] text-slate-400">{hint}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function Labelled({ label, children, span }) {
  return (
    <div className={span ? "sm:col-span-2" : undefined}>
      <label className={labelText}>{label}</label>
      {children}
    </div>
  );
}