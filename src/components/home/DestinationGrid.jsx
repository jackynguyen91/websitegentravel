import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { REGIONS } from "@/lib/sampleData";

export default function DestinationGrid() {
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="popular-destinations">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Điểm đến được yêu thích</p>
          <h2 id="popular-destinations" className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Bạn muốn bắt đầu từ đâu?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Chọn vùng miền để xem những hành trình phù hợp nhất với thời gian và ngân sách của bạn.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REGIONS.map((region) => (
            <Link
              key={region.name}
              to="/tours"
              search={region.search}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-slate-900"
            >
              <Image
                src={region.image}
                alt={region.name}
                className="h-full w-full transition duration-700 group-hover:scale-[1.06]"
                fittingType="fill"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">Khám phá hành trình</p>
                <h3 className="mt-1 font-heading text-xl font-bold">{region.name}</h3>
                <p className="mt-1 text-[12.5px] leading-snug text-white/80">{region.tagline}</p>
              </div>
              <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition group-hover:bg-white group-hover:text-ink">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}