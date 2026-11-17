import { Camera } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function ItineraryGallery({ images = [], destination }) {
  const photos = (images || []).filter(Boolean).slice(0, 6);
  if (!photos.length) return null;

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <h3 className="flex items-center gap-1.5 font-heading text-[15px] font-bold text-ink">
        <Camera className="h-4 w-4 text-brand" />
        Hình ảnh điểm đến
      </h3>
      <p className="mt-1 text-[12.5px] text-slate-500">
        Những điểm dừng chân nổi bật trong hành trình {destination}.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {photos.map((src, index) => (
          <figure key={`${src}-${index}`} className="overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={src}
              alt={`${destination} – ảnh điểm đến ${index + 1}`}
              className="aspect-[4/3] w-full"
              fittingType="fill"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}