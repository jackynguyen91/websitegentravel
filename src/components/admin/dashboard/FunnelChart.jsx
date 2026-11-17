export default function FunnelChart({ steps }) {
  const max = Math.max(...steps.map((step) => step.value), 1);

  return (
    <div className="space-y-2.5">
      {steps.map((step, index) => {
        const previous = index === 0 ? null : steps[index - 1].value;
        const rate = previous ? (step.value / previous) * 100 : null;
        return (
          <div key={step.step}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[12px] font-medium text-slate-600">{step.step}</p>
              <p className="text-[12px] font-semibold text-ink tnum">
                {step.value.toLocaleString("vi-VN")}
                {rate !== null && (
                  <span className="ml-1.5 text-[10.5px] font-medium text-slate-400">{rate.toFixed(0)}%</span>
                )}
              </p>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${Math.max((step.value / max) * 100, 2)}%`,
                  backgroundColor: ["#0F766E", "#14B8A6", "#38BDF8", "#F59E0B"][index % 4],
                }}
              />
            </div>
          </div>
        );
      })}
      <p className="pt-1 text-[10.5px] text-slate-400">
        Tỷ lệ chuyển đổi cuối phễu:{" "}
        <span className="font-semibold text-ink">
          {steps[0]?.value ? ((steps[steps.length - 1].value / steps[0].value) * 100).toFixed(1).replace(".", ",") : "0"}%
        </span>
      </p>
    </div>
  );
}