import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { CalendarCheck, Loader2, MapPinned, Search, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { searchAdmin } from "@/lib/admin-fns";
import { formatVND } from "@/lib/format";

const EMPTY = { bookings: [], customers: [], tours: [] };

export default function CommandPalette({ open, onOpenChange }) {
  const runSearch = useServerFn(searchAdmin);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults(EMPTY);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const text = query.trim();
    if (text.length < 2) {
      setResults(EMPTY);
      return undefined;
    }
    setLoading(true);
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      try {
        const data = await runSearch({ data: { q: text } });
        if (id === requestId.current) setResults(data);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, open, runSearch]);

  const go = (to) => {
    onOpenChange(false);
    navigate({ to });
  };

  const total = results.bookings.length + results.customers.length + results.tours.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[18%] max-w-xl translate-y-0 gap-0 p-0 sm:rounded-xl">
        <DialogTitle className="sr-only">Tìm kiếm toàn cục</DialogTitle>
        <DialogDescription className="sr-only">Tìm đơn đặt tour, khách hàng và tour</DialogDescription>
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nhập mã đơn, tên khách, số điện thoại hoặc tên tour…"
            className="h-8 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-slate-400"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
        </div>

        <div className="max-h-[360px] overflow-y-auto p-2">
          {query.trim().length < 2 ? (
            <p className="px-3 py-6 text-center text-[12.5px] text-slate-400">Nhập ít nhất 2 ký tự để tìm kiếm</p>
          ) : !loading && total === 0 ? (
            <p className="px-3 py-6 text-center text-[12.5px] text-slate-400">Không tìm thấy kết quả phù hợp</p>
          ) : (
            <div className="space-y-3">
              {results.bookings.length > 0 && (
                <div>
                  <p className="px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-400">Đơn đặt tour</p>
                  {results.bookings.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => go("/admin/bookings")}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-slate-50"
                    >
                      <CalendarCheck className="h-4 w-4 text-brand" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-ink">
                          {item.code} · {item.name}
                        </span>
                        <span className="block truncate text-[11.5px] text-slate-500">{item.tour}</span>
                      </span>
                      <span className="text-[12px] font-semibold text-ink tnum">{formatVND(item.total)}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.customers.length > 0 && (
                <div>
                  <p className="px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-400">Khách hàng</p>
                  {results.customers.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => go("/admin/customers")}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-slate-50"
                    >
                      <Users className="h-4 w-4 text-state-info" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-ink">{item.name}</span>
                        <span className="block truncate text-[11.5px] text-slate-500">
                          {item.phone} {item.city ? `· ${item.city}` : ""}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results.tours.length > 0 && (
                <div>
                  <p className="px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-400">Tour</p>
                  {results.tours.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => go("/admin/tours")}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-slate-50"
                    >
                      <MapPinned className="h-4 w-4 text-state-warning" />
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}