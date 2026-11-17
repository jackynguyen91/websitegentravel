import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PhoneCall } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import ServiceCard from "@/components/services/ServiceCard";
import { getActiveServices } from "@/lib/server-fns";

const TYPES = ["Vé máy bay", "Vé tham quan", "Khách sạn", "Visa"];

export const Route = createFileRoute("/_site/dich-vu-khac")({
  validateSearch: (search) => ({ type: typeof search.type === "string" ? search.type : undefined }),
  loader: async () => ({ services: await getActiveServices() }),
  head: () => ({
    meta: [
      { title: "Dịch vụ khác – Vé máy bay, vé tham quan, khách sạn & visa | GenTravel" },
      {
        name: "description",
        content:
          "GenTravel hỗ trợ đặt vé máy bay, vé tham quan, phòng khách sạn và làm visa trọn gói với giá minh bạch, tư vấn 24/7.",
      },
    ],
  }),
  component: OtherServicesPage,
});

function OtherServicesPage() {
  const { services } = Route.useLoaderData();
  const { type } = Route.useSearch();
  const shown = type ? services.filter((service) => service.type === type) : services;

  return (
    <>
      <PageHeader
        eyebrow="Dịch vụ khác"
        title="Vé máy bay, vé tham quan, khách sạn & visa"
        description="Ngoài tour trọn gói, GenTravel còn đặt giúp bạn từng phần của chuyến đi: vé máy bay nội địa và quốc tế, vé vào cổng điểm tham quan, phòng khách sạn và hồ sơ visa."
      />

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" aria-label="Lọc theo loại dịch vụ">
          <Link
            to="/dich-vu-khac"
            search={{}}
            className={`shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition ${
              type ? "border border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand" : "bg-brand text-white"
            }`}
          >
            Tất cả
          </Link>
          {TYPES.map((item) => (
            <Link
              key={item}
              to="/dich-vu-khac"
              search={{ type: item }}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition ${
                type === item
                  ? "bg-brand text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="mt-6 grid h-48 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white text-center">
            <div>
              <p className="font-heading text-base font-bold text-ink">Dịch vụ đang được cập nhật</p>
              <p className="mt-1 text-[13px] text-slate-500">Vui lòng gọi 1900 6789 để được báo giá ngay.</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        <section className="mt-10 overflow-hidden rounded-2xl bg-ink p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-lg font-extrabold text-white">Cần đặt vé, phòng hay làm visa?</h2>
              <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-slate-300">
                Gửi yêu cầu cho GenTravel, chuyên viên sẽ báo giá và hướng dẫn hồ sơ trong 30 phút làm việc.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="tel:19006789"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-[13px] font-semibold text-ink transition hover:bg-slate-100"
              >
                <PhoneCall className="h-4 w-4" />
                1900 6789
              </a>
              <Link
                to="/lien-he"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/25 px-4 text-[13px] font-semibold text-white transition hover:bg-white/10"
              >
                Gửi yêu cầu
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}