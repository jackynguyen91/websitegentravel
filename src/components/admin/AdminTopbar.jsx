import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Plus, Search } from "lucide-react";
import AdminAccountMenu from "@/components/admin/AdminAccountMenu";
import AdminNotifications from "@/components/admin/AdminNotifications";
import { ADMIN_NAV_FLAT, RANGE_OPTIONS } from "@/lib/admin/nav";

export default function AdminTopbar({ user, onOpenMobile, onOpenSearch, onCreateBooking, onLogout }) {
  const { pathname, search } = useRouterState({ select: (state) => state.location });
  const navigate = useNavigate();

  const current =
    ADMIN_NAV_FLAT.find((item) => (item.exact ? pathname === item.to : pathname.startsWith(item.to))) ||
    ADMIN_NAV_FLAT[0];

  const setRange = (value) => {
    navigate({ to: pathname, search: (prev) => ({ ...prev, range: value }), replace: true });
  };

  return (
    <header
      data-admin-chrome
      className="sticky top-0 z-30 border-b border-slate-200/80 bg-admin-card/90 backdrop-blur"
    >
      <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Mở menu"
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="hidden min-w-0 items-center gap-1.5 whitespace-nowrap text-[12.5px] text-slate-400 sm:flex">
          <span className="hidden shrink-0 md:inline">Quản trị</span>
          <span className="hidden shrink-0 text-slate-300 md:inline">/</span>
          <span className="hidden shrink-0 text-slate-500 md:inline">{current.group}</span>
          <span className="hidden shrink-0 text-slate-300 md:inline">/</span>
          <span className="truncate font-medium text-ink">{current.label}</span>
        </div>

        <button
          type="button"
          onClick={onOpenSearch}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:text-ink sm:ml-4 sm:w-[210px] sm:justify-start sm:gap-2 sm:px-2.5 lg:w-[260px]"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="hidden truncate text-[12.5px] text-slate-400 sm:block">Tìm đơn, khách, tour…</span>
          <kbd className="ml-auto hidden rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] font-semibold text-slate-400 lg:block">
            Ctrl K
          </kbd>
        </button>

        <select
          value={search?.range || "30d"}
          onChange={(event) => setRange(event.target.value)}
          aria-label="Khoảng thời gian"
          className="hidden h-9 rounded-lg border border-slate-200 bg-white px-2 text-[12.5px] font-medium text-slate-600 outline-none focus:border-brand md:block"
        >
          {RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <AdminNotifications />

        <AdminAccountMenu user={user} onLogout={onLogout} />

        <button
          type="button"
          onClick={onCreateBooking}
          aria-label="Tạo đơn đặt tour"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-2.5 text-[12.5px] font-semibold text-white transition hover:bg-brand-700 lg:px-3"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden lg:inline">Tạo đơn đặt tour</span>
        </button>
      </div>
    </header>
  );
}