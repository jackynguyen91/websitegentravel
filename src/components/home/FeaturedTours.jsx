import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import TourCard from "@/components/tours/TourCard";

export default function FeaturedTours({ tours = [] }) {
  return (
    <section className="bg-cloud py-16 sm:py-20" aria-labelledby="featured-tours">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Hành trình tuyển chọn</p>
            <h2 id="featured-tours" className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Tour nổi bật tháng này
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              Những hành trình được khách GenTravel đặt nhiều nhất, đã bao gồm vé máy bay, khách sạn và hướng dẫn viên.
            </p>
          </div>
          <Link
            to="/tours"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
          >
            Xem tất cả tour
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}