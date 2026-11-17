import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReportBarChart from "@/components/admin/reports/ReportBarChart";
import SalesPerformanceTable from "@/components/admin/reports/SalesPerformanceTable";
import WeeklyReportCard from "@/components/admin/reports/WeeklyReportCard";
import { computeReport, REPORT_RANGES } from "@/lib/report-calc";
import { exportCsv, exportPdf } from "@/lib/report-export";
import { formatCompactVND, formatDateVN, formatVND } from "@/lib/format";

export const Route = createFileRoute("/_authed/admin/reports")({
  component: AdminReports,
});

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));

function AdminReports() {
  const [range, setRange] = useState("30d");
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [costs, setCosts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [bookingRows, tourRows, costRows, paymentRows] = await Promise.all([
        base44.entities.Booking.list({ sort: "-booking_date", limit: 500 }),
        base44.entities.Tour.list({ limit: 200 }),
        base44.entities.TourCost.list({ limit: 500 }),
        base44.entities.Payment.list({ limit: 500 }),
      ]);
      setBookings(asArray(bookingRows));
      setTours(asArray(tourRows));
      setCosts(asArray(costRows));
      setPayments(asArray(paymentRows));
      setLoading(false);
    };
    load();
  }, []);

  const report = useMemo(
    () => computeReport({ bookings, tours, costs, payments, range }),
    [bookings, tours, costs, payments, range],
  );

  const periodLabel = `${formatDateVN(report.from)} – ${formatDateVN(report.to)}`;

  const handleExportCsv = () => {
    exportCsv(
      `bao-cao-${range}.csv`,
      ["Tour", "Đơn", "Doanh thu", "Chi phí", "Lợi nhuận gộp", "Biên %"],
      report.byTour.map((row) => [row.name, row.orders, row.revenue, row.cost, row.profit, row.margin.toFixed(1)]),
    );
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      await exportPdf({
        filename: `bao-cao-kinh-doanh-${range}.pdf`,
        title: "Báo cáo kinh doanh",
        subtitle: periodLabel,
        columns: ["Tour", "Đơn", "Doanh thu", "Chi phí", "LN gộp", "Biên"],
        rows: report.byTour.map((row) => [
          row.name,
          row.orders,
          formatVND(row.revenue),
          formatVND(row.cost),
          formatVND(row.profit),
          `${row.margin.toFixed(1)}%`,
        ]),
        summary: [
          { label: "Doanh thu", value: formatVND(report.revenue) },
          { label: "Lợi nhuận gộp", value: formatVND(report.profit) },
          { label: "Biên lợi nhuận", value: `${report.margin.toFixed(1)}%` },
          { label: "Tỷ lệ hủy", value: `${report.cancellationRate.toFixed(1)}%` },
        ],
      });
    } finally {
      setExporting(false);
    }
  };

  const kpis = [
    { label: "Doanh thu", value: formatVND(report.revenue), hint: `${report.orders} đơn hoàn tất` },
    { label: "Lợi nhuận gộp", value: formatVND(report.profit), hint: `Biên ${report.margin.toFixed(1)}%` },
    { label: "Đã thu tiền", value: formatVND(report.collected), hint: `Còn ${formatVND(Math.max(report.revenue - report.collected, 0))}` },
    { label: "Tỷ lệ hủy", value: `${report.cancellationRate.toFixed(1)}%`, hint: `${report.cancelledCount} đơn hủy` },
    { label: "Giá trị TB/đơn", value: formatVND(report.avgOrder), hint: `${report.byStaff.length} nhân viên bán` },
    { label: "Chi phí tour", value: formatVND(report.cost), hint: `${report.byTour.length} tour có doanh thu` },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink">Báo cáo & phân tích</h1>
          <p className="mt-1 text-[13px] text-slate-500">Kỳ báo cáo {periodLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {REPORT_RANGES.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setRange(item.key)}
              className={`h-9 rounded-lg px-3 text-[12px] font-semibold transition ${range === item.key ? "bg-brand text-white" : "bg-white text-slate-600 shadow-card hover:text-brand"}`}
            >
              {item.label}
            </button>
          ))}
          <button type="button" onClick={handleExportCsv} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-600 hover:text-brand">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={exporting}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-600 hover:text-brand disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5" /> {exporting ? "Đang xuất…" : "PDF"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-card">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-500">{item.label}</p>
            <p className="mt-1 text-[16px] font-bold text-ink tnum">{loading ? "…" : item.value}</p>
            <p className="text-[10.5px] text-slate-400">{item.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-ink">Lợi nhuận gộp theo tour</h3>
            <span className="text-[11px] text-slate-400">Top 8 tour</span>
          </div>
          <div className="mt-2">
            <ReportBarChart data={report.byTour} valueKey="profit" label="Lợi nhuận" color="#0F766E" height={250} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-ink">Doanh thu theo kênh</h3>
            <span className="text-[11px] text-slate-400">{formatCompactVND(report.revenue)}</span>
          </div>
          <div className="mt-2 space-y-2">
            {report.byChannel.length === 0 ? (
              <p className="py-10 text-center text-[12.5px] text-slate-500">Chưa có dữ liệu trong kỳ.</p>
            ) : (
              report.byChannel.map((channel) => (
                <div key={channel.name}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium text-slate-600">{channel.name}</span>
                    <span className="font-semibold text-ink tnum">{formatVND(channel.revenue)}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${report.revenue > 0 ? Math.round((channel.revenue / report.revenue) * 100) : 0}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-slate-400">{channel.orders} đơn</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
          <h3 className="text-[13px] font-bold text-ink">Hiệu suất nhân viên sale</h3>
          <p className="mb-2 text-[11.5px] text-slate-500">Doanh thu, số đơn và tỷ lệ hủy theo từng nhân viên phụ trách.</p>
          <SalesPerformanceTable rows={report.byStaff} />
        </div>
        <WeeklyReportCard />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="text-[13px] font-bold text-ink">Lợi nhuận theo tour</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead className="bg-cloud text-[11px] uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Tour</th>
                <th className="px-3 py-3 text-center font-semibold">Đơn</th>
                <th className="px-3 py-3 text-right font-semibold">Doanh thu</th>
                <th className="px-3 py-3 text-right font-semibold">Chi phí</th>
                <th className="px-3 py-3 text-right font-semibold">LN gộp</th>
                <th className="px-3 py-3 text-right font-semibold">Biên</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report.byTour.slice(0, 12).map((row) => (
                <tr key={row.id} className="hover:bg-cloud/60">
                  <td className="px-4 py-3 font-semibold text-ink">{row.name}</td>
                  <td className="px-3 py-3 text-center text-slate-600 tnum">{row.orders}</td>
                  <td className="px-3 py-3 text-right text-slate-700 tnum">{formatVND(row.revenue)}</td>
                  <td className="px-3 py-3 text-right text-slate-600 tnum">{formatVND(row.cost)}</td>
                  <td className={`px-3 py-3 text-right font-semibold tnum ${row.profit < 0 ? "text-red-600" : "text-emerald-700"}`}>{formatVND(row.profit)}</td>
                  <td className="px-3 py-3 text-right text-slate-600 tnum">{row.margin.toFixed(1)}%</td>
                </tr>
              ))}
              {report.byTour.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[12.5px] text-slate-500">
                    Chưa có đơn trong kỳ báo cáo này.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}