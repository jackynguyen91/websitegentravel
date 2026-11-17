import { Check, ChevronDown, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ALL_DEPARTURES, DEPARTURE_OPTIONS } from "@/lib/departure";
import { cn } from "@/lib/utils";

export default function DeparturePicker({ value, onChange, className }) {
  const options = [ALL_DEPARTURES, ...DEPARTURE_OPTIONS];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-[13px] font-semibold text-ink transition hover:border-brand hover:text-brand",
            className,
          )}
          aria-label="Chọn điểm khởi hành"
        >
          <MapPin className="h-4 w-4 text-brand" />
          <span className="max-w-[130px] truncate">{value}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 rounded-2xl p-4">
        <p className="font-heading text-sm font-extrabold text-ink">Chọn điểm khởi hành</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
          Chọn nơi bạn khởi hành để gợi ý những tour phù hợp nhất.
        </p>
        <div className="mt-3 space-y-1">
          {options.map((option) => {
            const active = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] font-medium transition",
                  active ? "bg-brand-50 text-brand" : "text-slate-600 hover:bg-slate-50 hover:text-ink",
                )}
              >
                {option}
                {active ? <Check className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}