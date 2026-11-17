import { Link } from "@tanstack/react-router";
import { Compass, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/lib/admin/nav";

export default function AdminSidebar({ user, collapsed, onToggle, onNavigate, onLogout }) {
  return (
    <div className="flex h-full flex-col bg-nav text-nav-foreground">
      <div className={cn("flex items-center gap-2.5 px-4 py-4", collapsed && "justify-center px-2")}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-white">
          <Compass className="h-5 w-5" strokeWidth={2.2} />
        </span>
        {!collapsed && (
          <div className="min-w-0 leading-none">
            <p className="truncate font-heading text-[15px] font-extrabold text-white">
              <span className="text-white">Gen</span>
              <span className="text-[#5EC8BC]">Travel</span>
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-nav-muted">Trang quản trị</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-3 no-scrollbar">
        {ADMIN_NAV.map((group) => (
          <div key={group.label} className="mt-2">
            {!collapsed && (
              <p className="px-2.5 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-nav-muted/80">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, exact }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={onNavigate}
                  title={collapsed ? label : undefined}
                  activeOptions={{ exact: Boolean(exact) }}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-nav-foreground/85 transition",
                    "hover:bg-white/8 hover:text-white",
                    collapsed && "justify-center px-0",
                  )}
                  activeProps={{ className: "bg-white/10 text-white ring-1 ring-inset ring-white/10" }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-2">
        {!collapsed ? (
          <div className="rounded-xl bg-white/5 p-3">
            <p className="truncate text-[12.5px] font-semibold text-white">{user?.full_name || user?.email}</p>
            <p className="mt-0.5 truncate text-[11px] text-nav-muted">{user?.email}</p>
            <div className="mt-2.5 flex flex-col gap-1">
              <Link
                to="/"
                className="inline-flex h-8 items-center justify-center rounded-lg border border-white/15 text-[11.5px] font-medium text-nav-foreground transition hover:bg-white/10"
              >
                Về trang chủ
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg text-[11.5px] font-medium text-nav-muted transition hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Đăng xuất
              </button>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "mt-1 hidden h-8 w-full items-center justify-center gap-2 rounded-lg text-[11.5px] font-medium text-nav-muted transition hover:bg-white/10 hover:text-white lg:flex",
          )}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!collapsed && "Thu gọn menu"}
        </button>
      </div>
    </div>
  );
}