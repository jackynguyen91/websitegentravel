import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ChevronRight, MapPin, PhoneCall, Star, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingWidget from "@/components/tours/BookingWidget";
import TourCard from "@/components/tours/TourCard";
import TourItinerary from "@/components/tours/TourItinerary";
import ItineraryGallery from "@/components/tours/ItineraryGallery";
import TourReviews from "@/components/tours/TourReviews";
import { getReviewsForTour, getTourBySlug, getTours } from "@/lib/server-fns";
import { durationLabel, finalPrice, formatVND } from "@/lib/format";

export const Route = createFileRoute("/_site/tours/$slug")({
  loader: async ({ params }) => {
    const tour = await getTourBySlug({ data: { slug: params.slug } });
    if (!tour) throw notFound();
    const [reviews, tours] = await Promise.all([
      getReviewsForTour({ data: { tour_slug: params.slug } }),
      getTours(),
    ]);
    return {
      tour,
      reviews,
      related: tours.filter((item) => item.slug !== tour.slug && item.region === tour.region).slice(0, 3),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.tour) return {};
    return {
      meta: [
        { title: `${loaderData.tour.title} – GenTravel` },
        {
          name: "description",
          content: `${loaderData.tour.title}: ${loaderData.tour.duration_days} ngày ${loaderData.tour.duration_nights} đêm, khởi hành từ ${loaderData.tour.departure_point}. ${loaderData.tour.highlights?.[0] || ""}`,
        },
      ],
    };
  },
  component: TourDetailPage,
});

function TourDetailPage() {
  const { tour, reviews, related } = Route.useLoaderData();
  const gallery = tour.gallery_images?.length ? tour.gallery_images : [tour.cover_image];
  const itineraryImages = tour.itinerary_images?.length
    ? tour.itinerary_images
    : [...new Set([...(tour.route || []).map((day) => day.image), ...gallery].filter(Boolean))].slice(0, 6);
  const price = finalPrice(tour);

  return (
    <div className="bg-cloud pb-20 lg:pb-4">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <nav className="flex items-center gap-1.5 text-[12px] text-slate-500" aria-label="Đường dẫn">
          <Link to="/" className="hover:text-brand">
            Trang chủ
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/tours" className="hover:text-brand">
            Tour du lịch
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-ink">{tour.title}</span>
        </nav>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          <div>
            <div className="grid gap-2 sm:grid-cols-[2fr_1fr]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-200">
                <Image src={gallery[0]} alt={tour.title} className="h-full w-full" fittingType="fill" />
                {Number(tour.discount_percent) > 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-sun px-3 py-1 text-xs font-bold text-ink">
                    Giảm {tour.discount_percent}%
                  </span>
                )}
              </div>
              <div className="hidden grid-rows-2 gap-2 sm:grid">
                {[gallery[1] || gallery[0], gallery[2] || gallery[0]].map((image, index) => (
                  <div key={index} className="relative overflow-hidden rounded-2xl bg-slate-200">
                    <Image
                      src={image}
                      alt={`${tour.title} – ảnh ${index + 2}`}
                      className="h-full w-full"
                      fittingType="fill"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-brand">
                  <MapPin className="h-3 w-3" />
                  {tour.destination}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                  {durationLabel(tour.duration_days, tour.duration_nights)}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{tour.category}</span>
              </div>

              <h1 className="mt-3 font-heading text-[clamp(1.4rem,3.6vw,2rem)] font-extrabold leading-tight tracking-tight text-ink">
                {tour.title}
              </h1>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-slate-600">
                <span className="inline-flex items-center gap-1 font-semibold text-ink">
                  <Star className="h-4 w-4 fill-sun text-sun" />
                  {Number(tour.rating || 0).toFixed(1)}
                  <span className="font-normal text-slate-500">({tour.review_count || reviews.length} đánh giá)</span>
                </span>
                <span>Khởi hành từ {tour.departure_point}</span>
                {tour.suitable_for?.length ? <span>Phù hợp: {tour.suitable_for.join(" · ")}</span> : null}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
              <Tabs defaultValue="overview">
                <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-cloud p-1">
                  {[
                    ["overview", "Tổng quan"],
                    ["itinerary", "Lịch trình chi tiết"],
                    ["services", "Bao gồm / Không bao gồm"],
                  ].map(([value, label]) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="rounded-lg px-3 py-2 text-[13px] font-semibold data-[state=active]:bg-white data-[state=active]:text-brand"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="mt-5">
                  <h2 className="font-heading text-base font-bold text-ink">Điểm nổi bật</h2>
                  <ul className="mt-3 space-y-2.5">
                    {(tour.highlights || []).map((item) => (
                      <li key={item} className="flex gap-2.5 text-[14px] leading-relaxed text-slate-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="itinerary" className="mt-5">
                  <TourItinerary route={tour.route} gallery={gallery} />
                  <ItineraryGallery images={itineraryImages} destination={tour.destination} />
                </TabsContent>

                <TabsContent value="services" className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h2 className="font-heading text-base font-bold text-ink">Dịch vụ bao gồm</h2>
                    <ul className="mt-3 space-y-2">
                      {(tour.included_services || []).map((item) => (
                        <li key={item} className="flex gap-2 text-[13.5px] leading-relaxed text-slate-600">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="font-heading text-base font-bold text-ink">Không bao gồm</h2>
                    <ul className="mt-3 space-y-2">
                      {(tour.excluded_services || []).map((item) => (
                        <li key={item} className="flex gap-2 text-[13.5px] leading-relaxed text-slate-600">
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

              </Tabs>
            </div>
          </div>

          <div className="lg:sticky lg:top-[84px] lg:self-start">
            <BookingWidget tour={tour} />
          </div>
        </div>

        <TourReviews tour={tour} initialReviews={reviews} />

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-heading text-xl font-extrabold text-ink">Tour tương tự</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <TourCard key={item.id} tour={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky booking bar for mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-16px_rgba(15,23,42,0.4)] backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-slate-400">Giá từ</p>
            <p className="font-heading text-lg font-extrabold leading-tight text-cta">
              {formatVND(price)}
              <span className="ml-1 text-[11px] font-medium text-slate-500">/khách</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:19006789"
              aria-label="Gọi tư vấn"
              className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-brand"
            >
              <PhoneCall className="h-4 w-4" />
            </a>
            <a
              href="#booking"
              className="inline-flex h-11 items-center rounded-xl bg-cta px-5 text-sm font-semibold text-white"
            >
              Đặt ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}