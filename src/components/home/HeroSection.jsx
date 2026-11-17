import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, PhoneCall } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/images";
import HeroSearchBar from "./HeroSearchBar";

const HERO_IMAGE = IMAGES.heroLandscape;
const HERO_CARD = IMAGES.heroPortrait;

export default function HeroSection({ destinations = [] }) {
  return (
    <section className="relative w-full overflow-hidden bg-white" aria-label="Giới thiệu GenTravel">
      <div className="relative grid lg:min-h-[660px]">
        {/* Media: right half on desktop, band below the text on mobile */}
        <div className="relative order-2 min-h-[300px] overflow-hidden bg-slate-200 sm:min-h-[380px] lg:absolute lg:inset-y-0 lg:left-1/2 lg:right-0 lg:order-none lg:min-h-0">
          <Image
            src={HERO_IMAGE}
            alt="Ruộng bậc thang Mù Cang Chải trong ánh bình minh"
            className="h-full w-full animate-slow-zoom"
            fittingType="fill"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/5 to-ink/55 lg:bg-gradient-to-r lg:from-white/25 lg:via-transparent lg:to-ink/35"
            aria-hidden="true"
          />
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-brand backdrop-blur sm:left-6 sm:top-6">
            <MapPin className="h-3 w-3" />
            Mù Cang Chải · Yên Bái
          </div>

          <div className="absolute bottom-5 left-4 right-[42%] hidden text-white sm:left-6 sm:block">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/75">Hành trình nổi bật</p>
            <p className="mt-1 font-heading text-lg font-bold leading-tight">Tây Bắc mùa lúa chín · 4N3Đ</p>
          </div>

          {/* Portrait card floating over the backdrop */}
          <div
            className="absolute bottom-4 right-4 w-[36%] max-w-[200px] animate-fade-up overflow-hidden rounded-xl border border-white/50 shadow-soft sm:bottom-6 sm:right-6"
            style={{ animationDelay: "0.42s" }}
          >
            <Image
              src={HERO_CARD}
              alt="Phố đèn lồng Hội An về đêm"
              className="aspect-[281/331] w-full"
              fittingType="fill"
            />
            <div className="bg-white px-2.5 py-2">
              <p className="text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate-400">Đang được yêu thích</p>
              <p className="font-heading text-[12px] font-semibold text-ink">Hội An về đêm</p>
            </div>
          </div>
        </div>

        {/* Text column: stays clear of the media half on desktop */}
        <div className="relative z-10 order-1 lg:absolute lg:inset-y-0 lg:left-0 lg:order-none lg:flex lg:w-1/2 lg:flex-col lg:justify-center">
          <div className="px-5 pb-9 pt-10 sm:px-8 lg:py-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12">
            <div className="flex flex-col gap-5 lg:max-w-[29rem]">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-sun" />
                Mạng lưới bán tour GenTravel
              </span>

              <h1
                className="animate-fade-up font-heading text-[clamp(2.35rem,6.4vw,3.9rem)] font-extrabold leading-[1.0] tracking-[-0.03em] text-black"
                style={{ animationDelay: "0.05s" }}
              >
                Chạm vào Việt Nam,
                <br />
                vươn ra <span className="text-brand">thế giới</span>
              </h1>

              <p
                className="animate-fade-up max-w-[42ch] text-[16px] leading-[1.7] text-slate-600"
                style={{ animationDelay: "0.18s" }}
              >
                Hành trình tuyển chọn khắp Việt Nam và châu Á với giá hợp lý, minh bạch từng khoản. Đặt chỗ trong 2
                phút, chuyên viên GenTravel gọi xác nhận trong 30 phút.
              </p>

              <div
                className="animate-fade-up flex flex-wrap items-center gap-3"
                style={{ animationDelay: "0.3s" }}
              >
                <Link
                  to="/tours"
                  className="inline-flex h-12 items-center gap-2 rounded-lg bg-cta px-6 text-[13px] font-semibold uppercase tracking-[0.04em] text-white transition hover:bg-cta-hover"
                >
                  Khám phá tour
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="tel:19006789"
                  className="inline-flex h-12 items-center gap-2 rounded-lg border border-slate-200 px-5 text-[13px] font-semibold text-ink transition hover:border-brand hover:text-brand"
                >
                  <PhoneCall className="h-4 w-4" />
                  Tư vấn miễn phí
                </a>
              </div>

              <p className="text-[12px] leading-relaxed text-slate-500">
                Phục vụ khách tại Hà Nội, TP. Hồ Chí Minh, Đà Nẵng và kiều bào ở nước ngoài · Hỗ trợ 24/7
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-14 sm:px-8 lg:pb-16">
        <HeroSearchBar destinations={destinations} />
      </div>
    </section>
  );
}