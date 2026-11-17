import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Compass, Menu, Phone, ShieldCheck, LogIn, X, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import DeparturePicker from "@/components/layout/DeparturePicker";
import {
  ALL_DEPARTURES,
  DEFAULT_DEPARTURE,
  DEPARTURE_OPTIONS,
  readDeparturePoint,
  saveDeparturePoint,
} from "@/lib/departure";

const NAV = [
  { label: "Trang chủ", to: "/" },
  { label: "Tour trong nước", to: "/tours", search: { scope: "domestic" } },
  { label: "Tour quốc tế", to: "/tours", search: { scope: "international" } },
  { label: "Dịch vụ khác", to: "/dich-vu-khac" },
  { label: "Liên hệ", to: "/lien-he" },
];

const HOTLINE = "1900 6789";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [departure, setDeparture] = useState(DEFAULT_DEPARTURE);
  const { user, isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const href = useRouterState({ select: (s) => s.location.href });
  const navigate = useNavigate();

  useEffect(() => {
    setDeparture(readDeparturePoint());
  }, []);

  const changeDeparture = (value) => {
    setDeparture(value);
    saveDeparturePoint(value);
    setOpen(false);
    navigate({
      to: "/tours",
      search: (prev) => ({
        ...prev,
        departure: value === ALL_DEPARTURES ? undefined : value,
      }),
    });
  };

  const isActive = (item) => {
    if (item.to === "/") return href === "/";
    return href.startsWith(item.to);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-5 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="GenTravel – trang chủ">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white shadow-sm">
            <Compass className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="leading-none">
            <span className="block font-heading text-[19px] font-extrabold tracking-tight text-ink">
              Gen<span className="text-brand">Travel</span>
            </span>
            <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Mạng lưới bán tour
            </span>
          </span>
        </Link>

        <nav className="ml-3 hidden min-w-0 items-center gap-0.5 lg:flex" aria-label="Điều hướng chính">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              search={item.search}
              className={`shrink-0 rounded-lg px-2 py-2 text-[13px] font-medium transition xl:px-3 xl:text-sm ${
                isActive(item) ? "bg-brand-50 text-brand" : "text-slate-600 hover:bg-slate-50 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <DeparturePicker value={departure} onChange={changeDeparture} className="hidden md:inline-flex" />

          <a
            href={`tel:${HOTLINE.replace(/\s/g, "")}`}
            className="hidden items-center gap-2 rounded-xl border border-brand-100 bg-brand-50 px-3.5 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand-100 sm:inline-flex"
          >
            <Phone className="h-4 w-4" />
            {HOTLINE}
          </a>

          {!isLoadingAuth && isAuthenticated && user?.role === "admin" ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Quản trị</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={navigateToLogin}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Mở menu"
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-ink lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86%] max-w-sm p-0">
              <SheetTitle className="sr-only">Menu GenTravel</SheetTitle>
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <span className="font-heading text-base font-bold text-ink">Danh mục</span>
                <button
                  type="button"
                  aria-label="Đóng menu"
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="border-b border-slate-100 px-4 pb-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Điểm khởi hành
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[ALL_DEPARTURES, ...DEPARTURE_OPTIONS].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => changeDeparture(option)}
                      className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition ${
                        option === departure
                          ? "border-brand bg-brand-50 text-brand"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <nav className="flex flex-col p-3" aria-label="Điều hướng di động">
                {NAV.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    search={item.search}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-[15px] font-medium text-slate-700 hover:bg-brand-50 hover:text-brand"
                  >
                    {item.label}
                  </Link>
                ))}
                {isAuthenticated && user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center gap-2 rounded-xl bg-ink px-3 py-3 text-[15px] font-semibold text-white"
                  >
                    <ShieldCheck className="h-4 w-4" /> Trang quản trị
                  </Link>
                )}
              </nav>
              <div className="mt-2 border-t border-slate-100 p-4">
                <a
                  href={`tel:${HOTLINE.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white"
                >
                  <Phone className="h-4 w-4" /> Hotline {HOTLINE}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}