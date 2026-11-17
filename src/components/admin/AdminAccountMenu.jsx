import { Link } from "@tanstack/react-router";
import { ChevronDown, ExternalLink, LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function useTheme() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const stored = window.localStorage.getItem("gentravel-theme");
    const initial = stored === "dark" ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("gentravel-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return { theme, toggle };
}

const initials = (user) =>
  (user?.full_name || user?.email || "GT")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function AdminAccountMenu({ user, onLogout }) {
  const { theme, toggle } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-1 pl-1 pr-2 transition hover:bg-slate-50"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-100 text-[11px] font-bold text-brand">
            {initials(user)}
          </span>
          <span className="hidden max-w-[120px] truncate text-[12.5px] font-medium text-ink sm:block">
            {user?.full_name || user?.email}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="pb-1">
          <p className="truncate text-[13px] font-semibold text-ink">{user?.full_name || "Quản trị viên"}</p>
          <p className="truncate text-[11.5px] font-normal text-slate-500">{user?.email}</p>
          <span className="mt-1.5 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-brand">
            {user?.role || "admin"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggle} className="cursor-pointer text-[13px]">
          {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer text-[13px]">
          <Link to="/">
            <ExternalLink className="mr-2 h-4 w-4" />
            Về trang chủ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-[13px] text-state-danger focus:text-state-danger">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}