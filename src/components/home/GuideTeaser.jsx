import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatDateVN } from "@/lib/format";

export default function GuideTeaser({ posts = [] }) {
  return (
    <section className="bg-white pb-16 pt-2 sm:pb-20" aria-labelledby="travel-guide">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Cẩm nang du lịch</p>
            <h2 id="travel-guide" className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Chuẩn bị thật tốt cho chuyến đi
            </h2>
          </div>
          <Link
            to="/cam-nang"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
          >
            Tất cả bài viết
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <article key={post.slug} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
              <Link to="/cam-nang/$slug" params={{ slug: post.slug }} className="block aspect-[16/10] overflow-hidden bg-slate-100">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  className="h-full w-full transition duration-700 group-hover:scale-[1.05]"
                  fittingType="fill"
                />
              </Link>
              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand">{post.category}</span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {formatDateVN(post.published_at)}
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-base font-bold leading-snug text-ink">
                  <Link to="/cam-nang/$slug" params={{ slug: post.slug }} className="transition hover:text-brand">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{post.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}