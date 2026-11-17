import { useEffect, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/lib/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import CommandPalette from "@/components/admin/CommandPalette";
import CreateBookingDialog from "@/components/admin/CreateBookingDialog";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const { user, isLoadingAuth, logout } = useAuth();
  const { pathname } = useRouterState({ select: (state) => state.location });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("gentravel-theme");
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setCreateOpen(false);
  }, [pathname]);

  if (isLoadingAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-admin-bg font-body text-sm text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand" />
          Đang tải khu quản trị…
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-admin-bg px-5 font-body">
        <div className="max-w-sm rounded-xl border border-slate-200 bg-admin-card p-8 text-center shadow-sm">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-state-warning/10 text-state-warning">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-lg font-semibold text-ink">Khu vực dành cho quản trị viên</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-slate-500">
            Tài khoản {user?.email || "hiện tại"} không có quyền truy cập trang quản trị GenTravel.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-brand px-4 text-[13px] font-semibold text-white"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-admin="true" className="min-h-screen bg-admin-bg font-body text-ink">
      <div className="flex min-h-screen">
        <aside
          data-admin-chrome
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block",
            collapsed ? "w-[76px]" : "w-[252px]",
          )}
        >
          <AdminSidebar
            user={user}
            collapsed={collapsed}
            onToggle={() => setCollapsed((prev) => !prev)}
            onLogout={() => logout("/")}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar
            user={user}
            onOpenMobile={() => setMobileOpen(true)}
            onOpenSearch={() => setSearchOpen(true)}
            onCreateBooking={() => setCreateOpen(true)}
            onLogout={() => logout("/")}
          />
          <main data-admin-main className="flex-1 px-3 py-5 sm:px-6 lg:px-7 lg:py-6">
            <Outlet />
          </main>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[268px] border-0 bg-nav p-0">
          <AdminSidebar user={user} collapsed={false} onToggle={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} onLogout={() => logout("/")} />
        </SheetContent>
      </Sheet>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
      <CreateBookingDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}