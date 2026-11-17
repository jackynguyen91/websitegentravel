export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-white">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-50 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl font-heading text-[clamp(1.75rem,4.2vw,2.6rem)] font-extrabold leading-tight tracking-tight text-ink">
          {title}
        </h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">{description}</p>}
        {children}
      </div>
    </section>
  );
}