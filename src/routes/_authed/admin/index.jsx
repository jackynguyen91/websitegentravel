import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import DashboardFilters from "@/components/admin/dashboard/DashboardFilters";
import DashboardSkeleton from "@/components/admin/dashboard/DashboardSkeleton";
import KpiCard from "@/components/admin/dashboard/KpiCard";
import ChartCard from "@/components/admin/dashboard/ChartCard";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import GroupDonut from "@/components/admin/dashboard/GroupDonut";
import TopToursChart from "@/components/admin/dashboard/TopToursChart";
import ChannelChart from "@/components/admin/dashboard/ChannelChart";
import FunnelChart from "@/components/admin/dashboard/FunnelChart";
import ProfitChart from "@/components/admin/dashboard/ProfitChart";
import DestinationChart from "@/components/admin/dashboard/DestinationChart";
import AlertsPanel from "@/components/admin/dashboard/AlertsPanel";
import UpcomingDepartures from "@/components/admin/dashboard/UpcomingDepartures";
import LatestBookings from "@/components/admin/dashboard/LatestBookings";
import { getDashboard } from "@/lib/admin-fns";
import { exportCsv } from "@/lib/admin/export";
import { formatDateVN, formatVND } from "@/lib/format";

export const Route = createFileRoute("/_authed/admin/")({
  validateSearch: (search) => ({
    range: typeof search.range === "string" ? search.range : undefined,
    from: typeof search.from === "string" ? search.from : undefined,
    to: typeof search.to === "string" ? search.to : undefined,
    scope: typeof search.scope === "string" ? search.scope : undefined,
    destination: typeof search.destination === "string" ? search.destination : undefined,
    channel: typeof search.channel === "string" ? search.channel : undefined,
    sale: typeof search.sale === "string" ? search.sale : undefined,
    compare: typeof search.compare === "string" ? search.compare : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getDashboard({ data: deps }),
  pendingComponent: DashboardSkeleton,
  head: () => ({ meta: [{ title: "Dashboard điều hành – GenTravel" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const router = useRouter();
  const [presentation, setPresentation] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.presentation = presentation ? "1" : "";
    return () => {
      document.documentElement.dataset.presentation = "";
    };
  }, [presentation]);

  useEffect(() => {
    if (!presentation) return undefined;
    const timer = setInterval(() => router.invalidate(), 60000);
    return () => clearInterval(timer);
  }, [presentation, router]);

  const exportReport = () => {
    exportCsv(data.kpis, "gentravel-tong-quan", [
      { label: "Chỉ số", value: "label" },
      { label: "Giá trị", value: (row) => Math.round(Number(row.value) * 100) / 100 },
      { label: "So với kỳ trước (%)", value: (row) => Number(row.delta).toFixed(1) },
    ]);
  };

  return (
    <div className={presentation ? "fixed inset-0 z-40 overflow-y-auto bg-admin-bg p-4 sm:p-6" : "space-y-3"}>
      <DashboardHeader
        subtitle={`${formatDateVN(data.range.start)} – ${formatDateVN(data.range.end)} · ${data.current.orders} đơn · ${formatVND(data.current.revenue)} đã thu`}
        onExportCsv={exportReport}
        onPrint={() => window.print()}
        presentation={presentation}
        onTogglePresentation={() => setPresentation((prev) => !prev)}
      />

      {!presentation && <DashboardFilters search={search} options={data.options} />}

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.key} kpi={kpi} invert={kpi.key === "cancelRate" || kpi.key === "receivable"} />
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Doanh thu & số đơn theo thời gian"
          subtitle="Cột doanh thu, đường số đơn, nét đứt là kỳ so sánh"
          filename="gentravel-doanh-thu"
          csvRows={data.series.month || data.series.week || data.series.day}
          csvColumns={[
            { label: "Thời gian", value: "label" },
            { label: "Doanh thu", value: "revenue" },
            { label: "Số đơn", value: "orders" },
            { label: "Kỳ trước", value: "prevRevenue" },
          ]}
          actions={
            <Link
              to="/admin/bookings"
              className="inline-flex h-7 items-center rounded-md border border-slate-200 px-1.5 text-[10.5px] font-medium text-slate-500 transition hover:text-ink"
            >
              Xem đơn
            </Link>
          }
        >
          <RevenueChart series={data.series} />
        </ChartCard>

        <ChartCard
          title="Cơ cấu doanh thu theo nhóm tour"
          subtitle="Nội địa · Quốc tế · Dịch vụ khác"
          filename="gentravel-co-cau-doanh-thu"
          csvRows={data.groups}
          csvColumns={[
            { label: "Nhóm", value: "name" },
            { label: "Doanh thu", value: "value" },
          ]}
        >
          <GroupDonut groups={data.groups} />
        </ChartCard>

        <ChartCard
          title="Top 5 tour bán chạy"
          subtitle="Theo doanh thu đã thanh toán hoặc số khách"
          filename="gentravel-top-tour"
          csvRows={data.topTours}
          csvColumns={[
            { label: "Tour", value: "name" },
            { label: "Doanh thu", value: "revenue" },
            { label: "Số khách", value: "guests" },
          ]}
        >
          <TopToursChart tours={data.topTours} />
        </ChartCard>

        <ChartCard
          title="Doanh thu theo kênh bán"
          subtitle="Website · Facebook · Zalo · Hotline · Đại lý"
          filename="gentravel-kenh-ban"
          csvRows={data.channels}
          csvColumns={[
            { label: "Kênh", value: "name" },
            { label: "Doanh thu", value: "value" },
          ]}
        >
          <ChannelChart channels={data.channels} />
        </ChartCard>

        <ChartCard
          title="Phễu chuyển đổi"
          subtitle="Yêu cầu đặt tour → Giữ chỗ → Xác nhận → Đã thanh toán"
          filename="gentravel-pheu-chuyen-doi"
          csvRows={data.funnel}
          csvColumns={[
            { label: "Bước", value: "step" },
            { label: "Số lượng", value: "value" },
          ]}
        >
          <FunnelChart steps={data.funnel} />
        </ChartCard>

        <ChartCard
          className="lg:col-span-2"
          title="Lợi nhuận gộp theo tháng"
          subtitle="Doanh thu trừ chi phí tour, 12 tháng gần nhất"
          filename="gentravel-loi-nhuan"
          csvRows={data.profitSeries}
          csvColumns={[
            { label: "Tháng", value: "label" },
            { label: "Doanh thu", value: "revenue" },
            { label: "Chi phí", value: "cost" },
            { label: "Lợi nhuận", value: "profit" },
          ]}
        >
          <ProfitChart data={data.profitSeries} />
        </ChartCard>

        <AlertsPanel alerts={data.alerts} />

        <ChartCard
          className="lg:col-span-2"
          title="Doanh thu theo điểm đến"
          subtitle="Top điểm đến theo doanh thu đã thanh toán"
          filename="gentravel-diem-den"
          csvRows={data.destinations}
          csvColumns={[
            { label: "Điểm đến", value: "name" },
            { label: "Doanh thu", value: "value" },
          ]}
        >
          <DestinationChart destinations={data.destinations} />
        </ChartCard>

        <UpcomingDepartures departures={data.upcoming} />
      </div>

      <LatestBookings bookings={data.latest} />
    </div>
  );
}