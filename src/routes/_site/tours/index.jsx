import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import TourCard from "@/components/tours/TourCard";
import TourFilters from "@/components/tours/TourFilters";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getTours } from "@/lib/server-fns";
import { finalPrice } from "@/lib/format";
import { matchesDeparture } from "@/lib/departure";

export const Route = createFileRoute("/_site/tours/")({
  loader: async () => ({ tours: await getTours() }),
  validateSearch: (search) => ({
    q: search.q || undefined,
    departure: search.departure || undefined,
    destination: search.destination || undefined,
    region: search.region || undefined,
    category: search.category || undefined,
    scope: search.scope || undefined,
    date: search.date || undefined,
    min_price: search.min_price ? Number(search.min_price) || undefined : undefined,
    max_price: search.max_price ? Number(search.max_price) || undefined : undefined,
    duration: search.duration || undefined,
    sort: search.sort || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Tất cả tour du lịch – GenTravel" },
      {
        name: "description",
        content: "Khám phá toàn bộ tour trong nước và quốc tế của GenTravel, lọc theo điểm đến, ngân sách và thời lượng.",
      },
    ],
  }),
  component: TourListPage,
});

const SORT_OPTIONS = [
  { value: "popular", label: "Phổ biến nhất" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "duration", label: "Thời lượng ngắn nhất" },
];

function TourListPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { tours: allTours } = Route.useLoaderData();
  const destinations = useMemo(() => [...new Set(allTours.map((tour) => tour.destination))], [allTours]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const update = (patch) => {
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
  };

  const reset = () => navigate({ search: {}, replace: true });

  const tours = useMemo(() => {
    const { q, departure, destination, region, category, scope, min_price, max_price, duration, sort = "popular" } = search;

    const list = allTours.filter((tour) => {
      if (!matchesDeparture(tour.departure_point, departure)) return false;
      if (destination && tour.destination !== destination) return false;
      if (region && tour.region !== region) return false;
      if (category && tour.category !== category) return false;
      if (scope && tour.scope !== scope) return false;
      if (duration) {
        if (duration === "1-3" && tour.duration_days > 3) return false;
        if (duration === "4-5" && (tour.duration_days < 4 || tour.duration_days > 5)) return false;
        if (duration === "6" && tour.duration_days < 6) return false;
      }
      const price = finalPrice(tour);
      if (min_price && price < min_price) return false;
      if (max_price && price > max_price) return false;
      if (q) {
        const haystack = `${tour.title} ${tour.destination} ${tour.region}`.toLowerCase();
        if (!haystack.includes(q.toLowerCase())) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "price-asc") return finalPrice(a) - finalPrice(b);
      if (sort === "price-desc") return finalPrice(b) - finalPrice(a);
      if (sort === "duration") return a.duration_days - b.duration_days;
      return Number(b.rating) * (b.review_count || 1) - Number(a.rating) * (a.review_count || 1);
    });
  }, [search, allTours]);

  const activeLabel =
    search.departure
      ? `Khởi hành từ ${search.departure}`
      : search.scope === "international"
      ? "Tour quốc tế"
      : search.scope === "domestic"
        ? "Tour trong nước"
        : search.category || search.destination || search.region || "Tất cả hành trình";

  const filters = (
    <TourFilters search={search} destinations={destinations} onChange={update} onReset={reset} />
  );

  return (
    <>
      <PageHeader
        eyebrow="Mạng lưới bán tour GenTravel"
        title={activeLabel}
        description="Chọn hành trình phù hợp với gia đình, cặp đôi hay nhóm bạn của bạn. Mọi tour đều đã bao gồm vé, lưu trú và hướng dẫn viên."
      />

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[84px]">{filters}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                Tìm thấy <span className="font-semibold text-ink">{tours.length}</span> tour phù hợp
              </p>
              <div className="flex items-center gap-2">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-ink lg:hidden"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Bộ lọc
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[88%] max-w-sm overflow-y-auto p-4">
                    <SheetTitle className="sr-only">Bộ lọc tour</SheetTitle>
                    <div onClick={() => setSheetOpen(false)}>{filters}</div>
                  </SheetContent>
                </Sheet>

                <label className="flex items-center gap-2 text-sm">
                  <span className="hidden text-slate-500 sm:inline">Sắp xếp:</span>
                  <select
                    value={search.sort || "popular"}
                    onChange={(event) => update({ sort: event.target.value })}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-ink outline-none focus:border-brand"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {tours.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
                <p className="font-heading text-lg font-bold text-ink">Chưa có tour nào khớp bộ lọc</p>
                <p className="mt-1 text-sm text-slate-500">Hãy thử mở rộng ngân sách hoặc bỏ bớt điều kiện lọc.</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-4 inline-flex h-11 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {tours.map((tour) => (
                  <TourCard key={tour.slug} tour={tour} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}