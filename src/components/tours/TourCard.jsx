import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { durationLabel, finalPrice, formatVND } from "@/lib/format";

export default function TourCard({ tour }) {
  const price = finalPrice(tour);
  const hasDiscount = Number(tour.discount_percent) > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <Link
        to="/tours/$slug"
        params={{ slug: tour.slug }}
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
        aria-label={tour.title}
      >
        <Image
          src={tour.cover_image}
          alt={tour.title}
          className="h-full w-full transition duration-700 group-hover:scale-[1.05]"
          fittingType="fill"
        />
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-sun px-2.5 py-1 text-[11px] font-bold text-ink">
            -{tour.discount_percent}%
          </span>
        )}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brand backdrop-blur">
          <MapPin className="h-3 w-3" />
          {tour.destination}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {durationLabel(tour.duration_days, tour.duration_nights)}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-ink">
            <Star className="h-3.5 w-3.5 fill-sun text-sun" />
            {Number(tour.rating || 0).toFixed(1)}
            {tour.review_count ? <span className="font-normal text-slate-400">({tour.review_count})</span> : null}
          </span>
        </div>

        <h3 className="font-heading text-[16px] font-bold leading-snug text-ink">
          <Link to="/tours/$slug" params={{ slug: tour.slug }} className="transition hover:text-brand">
            {tour.title}
          </Link>
        </h3>

        <p className="text-[12px] text-slate-500">Khởi hành từ {tour.departure_point}</p>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-slate-100 pt-3">
          <div>
            {hasDiscount && <span className="block text-[11px] text-slate-400 line-through">{formatVND(tour.price_adult)}</span>}
            <p className="font-heading text-[17px] font-extrabold leading-tight text-cta">
              {formatVND(price)}
              <span className="ml-1 text-[11px] font-medium text-slate-500">/khách</span>
            </p>
          </div>
          <Link
            to="/tours/$slug"
            params={{ slug: tour.slug }}
            className="inline-flex h-9 items-center rounded-lg bg-brand-50 px-3 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            Xem tour
          </Link>
        </div>
      </div>
    </article>
  );
}