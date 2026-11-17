import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { slugify } from "@/lib/slugify";

const CATEGORIES = ["Kinh nghiệm", "Điểm đến", "Ẩm thực", "Tin GenTravel"];

const field =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-ink outline-none transition focus:border-brand";
const labelText = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500";
const area = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] leading-relaxed text-ink outline-none focus:border-brand";

const emptyForm = () => ({
  title: "",
  slug: "",
  category: "Kinh nghiệm",
  thumbnail: "",
  summary: "",
  content: "",
  gallery_images: [],
  published_at: new Date().toISOString().slice(0, 10),
});

export default function PostFormDialog({ open, onOpenChange, post, onSaved }) {
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm(post ? { ...emptyForm(), ...post } : emptyForm());
  }, [open, post]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const setGallery = (index, value) => {
    setForm((prev) => {
      const next = [...(prev.gallery_images || [])];
      next[index] = value;
      return { ...prev, gallery_images: next };
    });
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Vui lòng nhập tiêu đề bài viết.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        category: form.category,
        thumbnail: form.thumbnail.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
        gallery_images: (form.gallery_images || [])
          .map((url) => String(url || "").trim())
          .filter(Boolean)
          .slice(0, 6),
        published_at: form.published_at,
      };
      if (post) {
        await base44.entities.BlogPost.update(post.id, payload);
      } else {
        await base44.entities.BlogPost.create(payload);
      }
      onSaved();
      onOpenChange(false);
    } catch {
      setError("Chưa lưu được bài viết. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogTitle className="font-heading text-lg font-extrabold text-ink">
          {post ? "Chỉnh sửa bài viết" : "Viết bài mới"}
        </DialogTitle>
        <DialogDescription className="text-[12.5px] text-slate-500">
          Bài viết xuất hiện trong mục Cẩm nang du lịch trên website.
        </DialogDescription>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelText}>Tiêu đề</label>
            <input className={field} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Bí kíp săn mây Đà Lạt cho người mới" />
          </div>
          <div>
            <label className={labelText}>Đường dẫn (slug)</label>
            <input className={field} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="de trong de tu tao" />
          </div>
          <div>
            <label className={labelText}>Chuyên mục</label>
            <select className={field} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelText}>Ảnh đại diện (URL)</label>
            <input className={field} value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} placeholder="https://…" />
          </div>
          <div>
            <label className={labelText}>Ngày đăng</label>
            <input type="date" className={field} value={form.published_at} onChange={(e) => set("published_at", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelText}>Tóm tắt</label>
            <textarea rows={2} className={area} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelText}>Nội dung (cách đoạn bằng dòng trống)</label>
            <textarea rows={12} className={area} value={form.content} onChange={(e) => set("content", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelText}>Ảnh trong bài (tối đa 6 ảnh, URL)</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => {
                const value = (form.gallery_images || [])[index] || "";
                return (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-11 shrink-0 text-[11px] font-semibold text-slate-400">Ảnh {index + 1}</span>
                    <input
                      className={field}
                      value={value}
                      onChange={(event) => setGallery(index, event.target.value)}
                      placeholder="https://…"
                    />
                    {value && <img src={value} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-[13px] font-semibold text-white disabled:opacity-70"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {post ? "Lưu thay đổi" : "Đăng bài"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}