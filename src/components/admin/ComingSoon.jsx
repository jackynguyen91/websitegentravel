import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function ComingSoon({ title, description, features = [] }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border border-slate-200/80 bg-admin-card p-6 shadow-sm sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-state-warning/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-state-warning">
            <Sparkles className="h-3 w-3" />
            Đang phát triển
          </span>
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h1>
        <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-slate-500">{description}</p>

        {features.length > 0 && (
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {features.map((item) => (
              <li key={item} className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[12.5px] text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-7 flex flex-wrap gap-2">
          <Link
            to="/admin"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-3.5 text-[13px] font-semibold text-white transition hover:bg-brand-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Về dashboard
          </Link>
          <Link
            to="/admin/bookings"
            className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Xem đơn đặt tour
          </Link>
        </div>
      </div>
    </div>
  );
}