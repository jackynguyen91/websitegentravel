import { ChevronDown, Download, Presentation, Printer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardHeader({ subtitle, onExportCsv, onPrint, presentation, onTogglePresentation }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-ink">Tổng quan kinh doanh</h1>
        <p className="mt-0.5 text-[12.5px] text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-admin-card px-3 text-[12.5px] font-medium text-slate-600 transition hover:text-ink"
            >
              <Download className="h-4 w-4" />
              Xuất báo cáo
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={onExportCsv} className="cursor-pointer text-[13px]">
              <Download className="mr-2 h-4 w-4" />
              Tải CSV (Excel)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPrint} className="cursor-pointer text-[13px]">
              <Printer className="mr-2 h-4 w-4" />
              In / Lưu PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          onClick={onTogglePresentation}
          className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-semibold transition ${
            presentation
              ? "bg-ink text-white"
              : "border border-slate-200 bg-admin-card text-slate-600 hover:text-ink"
          }`}
        >
          <Presentation className="h-4 w-4" />
          {presentation ? "Thoát trình chiếu" : "Chế độ trình chiếu"}
        </button>
      </div>
    </div>
  );
}