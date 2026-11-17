import { Image } from "@/components/ui/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function TourItinerary({ route = [], gallery = [] }) {
  const fallback = gallery.filter(Boolean);

  return (
    <Accordion type="single" collapsible defaultValue="day-1" className="w-full">
      {route.map((day) => {
        const image = day.image || (fallback.length ? fallback[(day.day - 1) % fallback.length] : null);

        return (
          <AccordionItem key={day.day} value={`day-${day.day}`} className="border-slate-100">
            <AccordionTrigger className="py-4 text-left hover:no-underline">
              <span className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-[12px] font-bold text-brand">
                  N{day.day}
                </span>
                <span className="font-heading text-[14.5px] font-semibold text-ink">{day.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:pl-11">
                <div className="w-full overflow-hidden rounded-xl bg-slate-100 sm:w-[210px] sm:shrink-0">
                  {image ? (
                    <Image
                      src={image}
                      alt={`${day.title} – ảnh địa điểm ngày ${day.day}`}
                      className="aspect-[16/10] w-full sm:aspect-[4/3]"
                      fittingType="fill"
                    />
                  ) : (
                    <div className="grid aspect-[16/10] w-full place-items-center text-[11px] text-slate-400 sm:aspect-[4/3]">
                      Đang cập nhật ảnh
                    </div>
                  )}
                </div>
                <p className="text-[14px] leading-[1.75] text-slate-600 sm:pt-1">{day.description}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}