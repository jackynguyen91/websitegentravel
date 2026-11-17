import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, Loader2, MapPin, Phone, Plus, Save, Tag, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getCustomerDetail, updateCustomerProfile } from "@/lib/admin-customers-fns";
import { statusStyle } from "@/lib/booking-status";
import { TIER_OPTIONS, tierStyle } from "@/lib/customer-tier";
import { formatDateVN, formatVND } from "@/lib/format";

const inputClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[12.5px] text-ink outline-none transition focus:border-brand";

export default function CustomerDrawer({ customerId, onClose, onChanged }) {
  const loadDetail = useServerFn(getCustomerDetail);
  const saveProfile = useServerFn(updateCustomerProfile);

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tier, setTier] = useState("Mới");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [note, setNote] = useState("");
  const [birthday, setBirthday] = useState("");

  const apply = (payload) => {
    const customer = payload?.customer;
    if (!customer) return;
    setTier(customer.tier || "Mới");
    setTags(customer.tags || []);
    setNote(customer.note || "");
    setBirthday(customer.birthday || "");
  };

  useEffect(() => {
    if (!customerId) {
      setDetail(null);
      return;
    }
    let alive = true;
    setLoading(true);
    (async () => {
      const result = await loadDetail({ data: { id: customerId } });
      if (!alive) return;
      setDetail(result);
      apply(result);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [customerId, loadDetail]);

  const customer = detail?.customer;

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (!tags.includes(value)) setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const save = async () => {
    if (!customer) return;
    setSaving(true);
    try {
      await saveProfile({ data: { id: customer.id, tier, tags, note, birthday } });
      toast.success("Đã lưu hồ sơ khách hàng");
      onChanged?.();
      const result = await loadDetail({ data: { id: customer.id } });
      setDetail(result);
      apply(result);
    } catch (error) {
      toast.error("Không lưu được hồ sơ khách hàng.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={Boolean(customerId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-[600px]">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 py-3">
          <SheetHeader className="space-y-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <SheetTitle className="font-heading text-lg font-extrabold text-ink">{customer?.full_name || "Hồ sơ khách hàng"}</SheetTitle>
              {customer && (
                <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${tierStyle(tier)}`}>{tier}</span>
              )}
            </div>
            <SheetDescription className="text-[12px] text-slate-500">
              {customer ? `${customer.phone} · ${customer.city || "Chưa cập nhật khu vực"}` : "Đang tải hồ sơ…"}
            </SheetDescription>
          </SheetHeader>

          {customer && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <select value={tier} onChange={(event) => setTier(event.target.value)} aria-label="Phân hạng khách" className={`h-8 rounded-lg border px-2 text-[11.5px] font-semibold outline-none ${tierStyle(tier)}`}>
                {TIER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-brand px-3 text-[11.5px] font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Lưu thay đổi
              </button>
            </div>
          )}
        </div>

        {loading && !customer && (
          <div className="grid flex-1 place-items-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        )}

        {customer && (
          <div className="space-y-3 p-4">
            <section className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                <p className="text-[10.5px] uppercase tracking-[0.06em] text-slate-400">Tổng chi tiêu</p>
                <p className="text-[15px] font-bold text-ink tnum">{formatVND(detail.stats.spend)}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                <p className="text-[10.5px] uppercase tracking-[0.06em] text-slate-400">Số đơn</p>
                <p className="text-[15px] font-bold text-ink tnum">{detail.stats.orders}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                <p className="text-[10.5px] uppercase tracking-[0.06em] text-slate-400">Tổng khách</p>
                <p className="text-[15px] font-bold text-ink tnum">{detail.stats.guests}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                <p className="text-[10.5px] uppercase tracking-[0.06em] text-slate-400">Đơn sắp tới</p>
                <p className="text-[15px] font-bold text-ink tnum">{detail.stats.upcoming}</p>
              </div>
            </section>

            <section className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Thông tin liên hệ</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
                  <div>
                    <p className="text-[10.5px] uppercase tracking-[0.06em] text-slate-400">Điện thoại</p>
                    <p className="text-[12.5px] font-medium text-ink">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <UserRound className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
                  <div>
                    <p className="text-[10.5px] uppercase tracking-[0.06em] text-slate-400">Email</p>
                    <p className="truncate text-[12.5px] font-medium text-ink">{customer.email || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
                  <div>
                    <p className="text-[10.5px] uppercase tracking-[0.06em] text-slate-400">Khu vực</p>
                    <p className="text-[12.5px] font-medium text-ink">{customer.city || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
                  <div>
                    <p className="text-[10.5px] uppercase tracking-[0.06em] text-slate-400">Đơn gần nhất</p>
                    <p className="text-[12.5px] font-medium text-ink">
                      {detail.stats.lastOrder ? formatDateVN(detail.stats.lastOrder) : "—"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-500">Sinh nhật</label>
                  <input type="date" value={birthday || ""} onChange={(event) => setBirthday(event.target.value)} className={inputClass} />
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-medium text-slate-500">Nguồn khách · phụ trách</p>
                  <p className="rounded-lg bg-cloud px-2.5 py-2 text-[12px] text-slate-600">
                    {customer.source_channel || "—"} · {customer.owner || "Chưa gán"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
              <h3 className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                <Tag className="h-3.5 w-3.5" /> Thẻ &amp; ghi chú
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand">
                    {tag}
                    <button type="button" onClick={() => setTags((prev) => prev.filter((item) => item !== tag))} aria-label={`Xóa thẻ ${tag}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {tags.length === 0 && <span className="text-[11.5px] text-slate-400">Chưa có thẻ nào.</span>}
              </div>
              <div className="mt-2 flex gap-1.5">
                <input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Thêm thẻ (VD: gia đình, honeymoon…)"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={addTag}
                  aria-label="Thêm thẻ"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-brand hover:text-brand"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder="Ghi chú chăm sóc khách hàng…"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[12.5px] text-ink outline-none transition focus:border-brand"
              />
            </section>

            <section className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Lịch sử đặt tour ({detail.bookings.length})</h3>
              <ul className="mt-1.5 divide-y divide-slate-100">
                {detail.bookings.length === 0 && <li className="py-3 text-[12px] text-slate-400">Chưa có đơn nào.</li>}
                {detail.bookings.map((booking) => (
                  <li key={booking.id} className="flex items-start justify-between gap-2 py-2">
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold text-ink">
                        {booking.code} · <span className="font-medium text-slate-600">{booking.tour_title}</span>
                      </p>
                      <p className="text-[10.5px] text-slate-400">
                        Khởi hành {formatDateVN(booking.departure_date)} · Đặt {formatDateVN(booking.booking_date)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[12px] font-semibold text-ink tnum">{formatVND(booking.total)}</p>
                      <span className={`mt-0.5 inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}