const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function DepartureMonthGrid({ year, month, byDate, selected, onSelect }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const today = new Date().toISOString().slice(0, 10);

  const cells = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const keyOf = (day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
      <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="h-[74px] rounded-lg bg-cloud/40" />;
          const key = keyOf(day);
          const departures = byDate[key] || [];
          const seats = departures.reduce((acc, item) => ({ total: acc.total + item.total, used: acc.used + item.booked + item.held }), { total: 0, used: 0 });
          const fill = seats.total > 0 ? Math.round((seats.used / seats.total) * 100) : 0;
          const isSelected = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`h-[74px] rounded-lg border p-1.5 text-left transition ${
                isSelected ? "border-brand bg-brand-50" : "border-slate-100 hover:border-brand/40 hover:bg-cloud/60"
              }`}
            >
              <span className={`text-[12px] font-semibold ${key === today ? "text-brand" : "text-slate-600"}`}>{day}</span>
              {departures.length > 0 ? (
                <>
                  <span className="mt-1 block text-[10.5px] font-semibold text-slate-600">{departures.length} chuyến</span>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className={`block h-full rounded-full ${fill >= 100 ? "bg-red-500" : fill >= 80 ? "bg-amber-500" : "bg-brand"}`}
                      style={{ width: `${Math.min(fill, 100)}%` }}
                    />
                  </span>
                  <span className="mt-0.5 block text-[10px] text-slate-400 tnum">{seats.used}/{seats.total} chỗ</span>
                </>
              ) : (
                <span className="mt-3 block text-[10px] text-slate-300">—</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}