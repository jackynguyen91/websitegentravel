import { Link } from "@tanstack/react-router";
import { PhoneCall } from "lucide-react";

export default function CtaBand() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-12 text-white sm:px-12 sm:py-14">
          <div className="topo-pattern pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
                Cần một hành trình thiết kế riêng?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Cho chúng tôi biết số người, ngân sách và thời gian. Chuyên viên GenTravel sẽ gửi lịch trình chi tiết
                trong 24 giờ, hoàn toàn miễn phí, dù bạn ở Hà Nội, TP. Hồ Chí Minh, Đà Nẵng hay nước ngoài.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/lien-he"
                className="inline-flex h-12 items-center rounded-xl bg-cta px-6 text-sm font-semibold text-white transition hover:bg-cta-hover"
              >
                Gửi yêu cầu tư vấn
              </Link>
              <a
                href="tel:19006789"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <PhoneCall className="h-4 w-4" />
                1900 6789
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}