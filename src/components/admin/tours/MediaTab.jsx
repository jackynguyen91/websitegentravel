import { useRef, useState } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Section, field, ghostButton, labelText } from "@/components/admin/tours/form-parts";

function UploadButton({ onUploaded, label = "Tải ảnh lên" }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (event) => {
    const files = [...(event.target.files || [])];
    if (files.length === 0) return;
    setBusy(true);
    try {
      const urls = [];
      for (const file of files) {
        const result = await base44.integrations.Core.UploadPublicFile({ file });
        if (result?.file_url) urls.push(result.file_url);
      }
      onUploaded(urls);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className={ghostButton} aria-label={label}>
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        {busy ? "Đang tải…" : label}
      </button>
    </>
  );
}

function ImageList({ label, items, onChange, max, hint }) {
  const rows = items || [];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className={labelText}>{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            {rows.length} ảnh{max ? ` / tối đa ${max}` : ""}
          </span>
          <UploadButton
            onUploaded={(urls) => onChange(max ? [...rows, ...urls].slice(0, max) : [...rows, ...urls])}
          />
        </div>
      </div>
      {hint ? <p className="mt-1 text-[11.5px] text-slate-400">{hint}</p> : null}
      <div className="mt-2 space-y-2">
        {rows.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              {url ? <Image src={url} alt="" className="h-full w-full" fittingType="fill" /> : null}
            </div>
            <input
              className={field}
              value={url}
              placeholder="https://…"
              onChange={(e) => onChange(rows.map((item, i) => (i === index ? e.target.value : item)))}
            />
            <button
              type="button"
              aria-label="Xóa ảnh"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className="grid h-10 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      {(!max || rows.length < max) && (
        <button type="button" onClick={() => onChange([...rows, ""])} className={`${ghostButton} mt-2`}>
          <Plus className="h-3.5 w-3.5" /> Thêm ô ảnh
        </button>
      )}
    </div>
  );
}

export default function MediaTab({ form, set }) {
  return (
    <div className="space-y-3">
      <Section title="Ảnh đại diện">
        <div className="flex flex-wrap items-start gap-3">
          <div className="h-24 w-36 overflow-hidden rounded-xl bg-slate-100">
            {form.cover_image ? <Image src={form.cover_image} alt="Ảnh đại diện" className="h-full w-full" fittingType="fill" /> : null}
          </div>
          <div className="min-w-[220px] flex-1 space-y-2">
            <input className={field} placeholder="https://…" value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} />
            <UploadButton label="Tải ảnh đại diện" onUploaded={(urls) => urls[0] && set("cover_image", urls[0])} />
          </div>
        </div>
      </Section>

      <Section title="Thư viện ảnh">
        <ImageList label="Ảnh thư viện" items={form.gallery_images} onChange={(value) => set("gallery_images", value)} hint="Ảnh dùng cho gallery đầu trang tour chi tiết." />
      </Section>

      <Section title="Ảnh điểm đến trong lịch trình">
        <ImageList
          label="Ảnh lịch trình"
          items={form.itinerary_images}
          onChange={(value) => set("itinerary_images", value)}
          max={6}
          hint="Tối đa 6 ảnh, hiển thị xen trong phần lịch trình."
        />
      </Section>
    </div>
  );
}