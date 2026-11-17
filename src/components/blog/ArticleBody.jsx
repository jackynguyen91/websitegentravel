import { Image } from "@/components/ui/image";

const MAX_IMAGES = 6;

// Chèn ảnh rải đều vào giữa các đoạn văn để bài viết dễ đọc hơn.
function groupImages(images, paragraphCount) {
  const groups = new Map();
  images.forEach((src, index) => {
    const position = Math.floor(((index + 1) * (paragraphCount + 1)) / (images.length + 1));
    const list = groups.get(position) || [];
    list.push({ src, key: `img-${index}` });
    groups.set(position, list);
  });
  return groups;
}

export default function ArticleBody({ content, images, title }) {
  const paragraphs = (content || "")
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const gallery = (images || []).filter(Boolean).slice(0, MAX_IMAGES);
  const groups = groupImages(gallery, paragraphs.length);

  const renderGroup = (position) => {
    const group = groups.get(position);
    if (!group) return null;
    return (
      <div key={`images-${position}`} className={group.length > 1 ? "grid grid-cols-2 gap-3" : ""}>
        {group.map(({ src, key }) => (
          <figure key={key} className="overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={src}
              alt={`${title} – ảnh minh hoạ`}
              className={group.length > 1 ? "aspect-[4/3] w-full" : "aspect-[16/10] w-full"}
              fittingType="fill"
            />
          </figure>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-7 space-y-6">
      {renderGroup(0)}
      {paragraphs.map((paragraph, index) => (
        <div key={`block-${index}`} className="space-y-6">
          <p className="text-[15.5px] leading-[1.85] text-slate-700">{paragraph}</p>
          {renderGroup(index + 1)}
        </div>
      ))}
    </div>
  );
}