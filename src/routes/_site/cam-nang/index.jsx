import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import { Image } from "@/components/ui/image";
import { getPosts } from "@/lib/server-fns";
import { formatDateVN } from "@/lib/format";

export const Route = createFileRoute("/_site/cam-nang/")({
  loader: async () => ({ posts: await getPosts() }),
  head: () => ({
    meta: [
      { title: "Cẩm nang du lịch – GenTravel" },
      { name: "description", content: "Kinh nghiệm, điểm đến và ẩm thực cho những chuyến đi trọn vẹn cùng GenTravel." },
    ],
  }),
  component: BlogListPage,
});

function BlogListPage() {
  const { posts } = Route.useLoaderData();
  const [featured, ...rest] = posts;

  if (!featured) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-ink">Cẩm nang đang được cập nhật</h1>
        <p className="mt-2 text-sm text-slate-600">Các bài viết mới sẽ sớm được đăng tải.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Cẩm nang du lịch"
        title="Câu chuyện từ những miền đất"
        description="Kinh nghiệm thực tế, gợi ý điểm đến và ẩm thực bản địa do chuyên viên GenTravel và khách hàng chia sẻ."
      />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <Link
          to="/cam-nang/$slug"
          params={{ slug: featured.slug }}
          className="group grid overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card md:grid-cols-2"
        >
          <div className="aspect-[16/10] overflow-hidden bg-slate-100 md:aspect-auto">
            <Image
              src={featured.thumbnail}
              alt={featured.title}
              className="h-full w-full transition duration-700 group-hover:scale-[1.03]"
              fittingType="fill"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <div className="flex items-center gap-2 text-[11.5px] font-medium text-slate-500">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand">{featured.category}</span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {formatDateVN(featured.published_at)}
              </span>
            </div>
            <h2 className="mt-3 font-heading text-2xl font-extrabold leading-tight text-ink transition group-hover:text-brand">
              {featured.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{featured.summary}</p>
            <span className="mt-5 text-[13px] font-semibold text-brand">Đọc bài viết →</span>
          </div>
        </Link>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {rest.map((post) => (
            <article key={post.slug} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
              <Link to="/cam-nang/$slug" params={{ slug: post.slug }} className="block aspect-[16/9] overflow-hidden bg-slate-100">
                <Image src={post.thumbnail} alt={post.title} className="h-full w-full" fittingType="fill" />
              </Link>
              <div className="p-5">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand">{post.category}</span>
                <h3 className="mt-3 font-heading text-base font-bold leading-snug text-ink">
                  <Link to="/cam-nang/$slug" params={{ slug: post.slug }} className="hover:text-brand">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{post.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}