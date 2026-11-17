export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-8 w-64 rounded-lg bg-slate-200/70" />
      <div className="h-11 rounded-xl border border-slate-200/80 bg-admin-card" />
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-[92px] rounded-xl border border-slate-200/80 bg-admin-card" />
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="h-[340px] rounded-xl border border-slate-200/80 bg-admin-card lg:col-span-2" />
        <div className="h-[340px] rounded-xl border border-slate-200/80 bg-admin-card" />
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-[300px] rounded-xl border border-slate-200/80 bg-admin-card" />
        ))}
      </div>
    </div>
  );
}