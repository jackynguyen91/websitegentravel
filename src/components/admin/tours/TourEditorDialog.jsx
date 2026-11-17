import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { slugify } from "@/lib/slugify";
import BasicsTab from "@/components/admin/tours/BasicsTab";
import PricingTab from "@/components/admin/tours/PricingTab";
import ItineraryTab from "@/components/admin/tours/ItineraryTab";
import MediaTab from "@/components/admin/tours/MediaTab";
import PolicyTab from "@/components/admin/tours/PolicyTab";
import SeoTab from "@/components/admin/tours/SeoTab";

const TABS = [
  { key: "basics", label: "Thông tin" },
  { key: "pricing", label: "Giá & phụ thu" },
  { key: "itinerary", label: "Lịch trình" },
  { key: "media", label: "Hình ảnh" },
  { key: "policy", label: "Bao gồm & hủy" },
  { key: "seo", label: "SEO" },
];

const emptyForm = () => ({
  title: "",
  slug: "",
  destination: "",
  region: "Miền Bắc",
  scope: "domestic",
  category: "Tour trong nước",
  duration_days: 3,
  duration_nights: 2,
  price_adult: 0,
  price_child: 0,
  price_infant: 0,
  cost_adult: 0,
  cost_child: 0,
  cost_infant: 0,
  discount_percent: 0,
  status: "Nháp",
  departure_point: "Hà Nội",
  seats_total: 20,
  surcharges: [],
  cancellation_policy: [],
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  cover_image: "",
  gallery_images: [],
  itinerary_images: [],
  highlights: [],
  route: [{ day: 1, title: "", description: "", image: "" }],
  included_services: [],
  excluded_services: [],
  suitable_for: [],
  is_featured: false,
  rating: 4.8,
  review_count: 0,
  view_count: 0,
});

export default function TourEditorDialog({ open, onOpenChange, tour, onSaved }) {
  const [form, setForm] = useState(emptyForm());
  const [tab, setTab] = useState("basics");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(tour?.id);

  useEffect(() => {
    if (!open) return;
    setTab("basics");
    setError("");
    if (tour) {
      setForm({
        ...emptyForm(),
        ...tour,
        surcharges: tour.surcharges || [],
        cancellation_policy: tour.cancellation_policy || [],
        gallery_images: tour.gallery_images || [],
        itinerary_images: tour.itinerary_images || [],
        highlights: tour.highlights || [],
        included_services: tour.included_services || [],
        excluded_services: tour.excluded_services || [],
        suitable_for: tour.suitable_for || [],
        route: tour.route?.length ? tour.route : [{ day: 1, title: "", description: "", image: "" }],
        status: tour.status || "Đang bán",
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, tour]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const generateSeo = () => {
    const days = Number(form.duration_days) || 1;
    const nights = Number(form.duration_nights) || 0;
    setForm((prev) => ({
      ...prev,
      seo_title: `${prev.title} ${days} ngày ${nights} đêm | GenTravel`.slice(0, 60),
      seo_description: `Đặt tour ${prev.title.toLowerCase()} tại GenTravel: lịch trình ${days} ngày ${nights} đêm chi tiết, giá minh bạch, khởi hành ${prev.departure_point}. Hỗ trợ 24/7, xác nhận nhanh.`.slice(0, 160),
      seo_keywords: `${prev.title.toLowerCase()}, tour ${prev.destination.toLowerCase()}, tour ${days} ngày ${nights} đêm`,
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.destination.trim()) {
      setTab("basics");
      setError("Vui lòng nhập tên tour và điểm đến.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        slug: (form.slug.trim() || slugify(form.title)).toLowerCase(),
        destination: form.destination.trim(),
        region: form.region,
        scope: form.scope,
        category: form.category,
        duration_days: Number(form.duration_days) || 1,
        duration_nights: Number(form.duration_nights) || 0,
        price_adult: Number(form.price_adult) || 0,
        price_child: Number(form.price_child) || 0,
        price_infant: Number(form.price_infant) || 0,
        cost_adult: Number(form.cost_adult) || 0,
        cost_child: Number(form.cost_child) || 0,
        cost_infant: Number(form.cost_infant) || 0,
        discount_percent: Number(form.discount_percent) || 0,
        status: form.status,
        departure_point: form.departure_point.trim(),
        seats_total: Number(form.seats_total) || 0,
        surcharges: form.surcharges
          .filter((row) => row.label?.trim())
          .map((row) => ({ label: row.label.trim(), amount: Number(row.amount) || 0, unit: row.unit })),
        cancellation_policy: form.cancellation_policy.map((row) => ({
          days_before: Number(row.days_before) || 0,
          fee_percent: Number(row.fee_percent) || 0,
          note: (row.note || "").trim(),
        })),
        seo_title: form.seo_title.trim(),
        seo_description: form.seo_description.trim(),
        seo_keywords: form.seo_keywords.trim(),
        cover_image: form.cover_image.trim(),
        gallery_images: form.gallery_images.filter((url) => url.trim()),
        itinerary_images: form.itinerary_images.filter((url) => url.trim()).slice(0, 6),
        highlights: form.highlights.filter((item) => item.trim()),
        included_services: form.included_services.filter((item) => item.trim()),
        excluded_services: form.excluded_services.filter((item) => item.trim()),
        suitable_for: form.suitable_for.filter((item) => item.trim()),
        route: form.route
          .filter((day) => day.title?.trim())
          .map((day, index) => ({
            day: index + 1,
            title: day.title.trim(),
            description: (day.description || "").trim(),
            image: (day.image || "").trim(),
          })),
        is_featured: Boolean(form.is_featured),
        rating: Number(form.rating) || 4.8,
        review_count: Number(form.review_count) || 0,
        view_count: Number(form.view_count) || 0,
      };

      if (isEdit) {
        await base44.entities.Tour.update(tour.id, payload);
      } else {
        await base44.entities.Tour.create(payload);
      }
      onSaved();
      onOpenChange(false);
    } catch {
      setError("Chưa lưu được tour. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[94vh] w-[calc(100vw-2rem)] max-w-4xl overflow-hidden p-0">
        <div className="flex flex-col max-h-[94vh]">
          <div className="border-b border-slate-100 px-5 pt-5">
            <DialogTitle className="font-heading text-lg font-extrabold text-ink">
              {isEdit ? `Sửa tour · ${tour.title}` : "Thêm tour mới"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-[12.5px] text-slate-500">
              {isEdit ? "Cập nhật giá, lịch trình, hình ảnh, chính sách và SEO." : "Tạo tour mới với đầy đủ giá bán, lịch trình, hình ảnh và SEO."}
            </DialogDescription>
            <div className="mt-3 flex gap-1 overflow-x-auto no-scrollbar">
              {TABS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`shrink-0 rounded-t-lg px-3 py-2 text-[12.5px] font-semibold transition ${
                    tab === item.key ? "bg-brand-50 text-brand" : "text-slate-500 hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-cloud/60 px-5 py-4">
            {tab === "basics" && <BasicsTab form={form} set={set} />}
            {tab === "pricing" && <PricingTab form={form} set={set} />}
            {tab === "itinerary" && <ItineraryTab form={form} set={set} />}
            {tab === "media" && <MediaTab form={form} set={set} />}
            {tab === "policy" && <PolicyTab form={form} set={set} />}
            {tab === "seo" && <SeoTab form={form} set={set} onGenerate={generateSeo} />}
            {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">{error}</p>}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3">
            <span className="text-[11.5px] text-slate-400">{form.status} · {form.route.length} ngày lịch trình</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => onOpenChange(false)} className="h-10 rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-600">
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-[13px] font-semibold text-white disabled:opacity-70"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isEdit ? "Lưu thay đổi" : "Tạo tour"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}