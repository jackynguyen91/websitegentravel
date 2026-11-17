import { Link } from "@tanstack/react-router";
import { Check, PhoneCall } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatVND } from "@/lib/format";

export default function ServiceCard({ service }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {service.image ? (
          <Image src={service.image} alt={service.title} className="h-full w-full" fittingType="fill" />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brand shadow-sm">
          {service.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-[15.5px] font-bold leading-snug text-ink">{service.title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{service.summary}</p>

        {service.highlights?.length ? (
          <ul className="mt-3 space-y-1.5">
            {service.highlights.slice(0, 3).map((item) => (
              <li key={item} className="flex gap-2 text-[12.5px] leading-relaxed text-slate-600">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-4">
          {Number(service.price_from) > 0 ? (
            <p className="font-heading text-[17px] font-extrabold leading-tight text-cta">
              {formatVND(service.price_from)}
              {service.price_unit ? (
                <span className="ml-1 text-[11px] font-medium text-slate-500">/{service.price_unit}</span>
              ) : null}
            </p>
          ) : (
            <p className="text-[13px] font-semibold text-slate-600">Giá theo yêu cầu</p>
          )}
          {service.price_note ? <p className="mt-0.5 text-[11.5px] text-slate-400">{service.price_note}</p> : null}

          <div className="mt-3 flex items-center gap-2">
            <Link
              to="/lien-he"
              className="inline-flex h-9 items-center rounded-lg bg-cta px-3.5 text-[12.5px] font-semibold text-white transition hover:bg-cta-hover"
            >
              Nhận báo giá
            </Link>
            <a
              href="tel:19006789"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[12.5px] font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Gọi tư vấn
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}