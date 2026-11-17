import { createFileRoute } from "@tanstack/react-router";
import { Clock4, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/_site/lien-he")({
  head: () => ({
    meta: [
      { title: "Liên hệ GenTravel – Tư vấn tour 24/7" },
      { name: "description", content: "Gọi hotline 1900 6789 hoặc gửi email để được chuyên viên GenTravel tư vấn hành trình." },
    ],
  }),
  component: ContactPage,
});

const CHANNELS = [
  {
    icon: Phone,
    title: "Hotline",
    value: "1900 6789",
    note: "Hoạt động 8:00 – 21:00 mỗi ngày",
    href: "tel:19006789",
  },
  {
    icon: Mail,
    title: "Email",
    value: "hotro@gentravel.vn",
    note: "Phản hồi trong vòng 4 giờ làm việc",
    href: "mailto:hotro@gentravel.vn",
  },
  {
    icon: MessageCircle,
    title: "Zalo / Viber",
    value: "0912 345 678",
    note: "Nhắn tin để nhận báo giá nhanh",
    href: "tel:0912345678",
  },
  {
    icon: MapPin,
    title: "Văn phòng",
    value: "Tòa nhà Bitexco, 2 Hải Triều, Quận 1",
    note: "TP. Hồ Chí Minh",
  },
];

const FAQS = [
  {
    q: "Tôi cần đặt tour trước bao lâu?",
    a: "Với tour trong nước, bạn nên đặt trước 7 – 10 ngày để giữ được giá tốt và phòng ưng ý. Tour quốc tế cần trước 30 – 45 ngày để kịp hoàn tất visa và vé máy bay.",
  },
  {
    q: "Trẻ em được tính giá như thế nào?",
    a: "Trẻ từ 2 đến 11 tuổi tính 60 – 75% giá người lớn tùy tour, trẻ dưới 2 tuổi miễn phí nếu ngủ cùng bố mẹ. Mức giá cụ thể được ghi rõ trong phần giá của từng tour.",
  },
  {
    q: "GenTravel có hỗ trợ hoàn tiền khi hủy tour không?",
    a: "Có. Bạn được hoàn 100% tiền cọc khi hủy trước 15 ngày khởi hành, hoàn 70% khi hủy trước 7 ngày và áp dụng theo điều kiện của từng nhà cung cấp dịch vụ.",
  },
  {
    q: "Công ty có tổ chức tour riêng cho đoàn công ty không?",
    a: "Có. Chúng tôi nhận thiết kế tour riêng cho đoàn từ 10 khách, bao gồm team building, gala dinner và xe riêng theo yêu cầu.",
  },
];

function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Liên hệ"
        title="Chuyên viên GenTravel luôn ở đây"
        description="Bạn cần tư vấn hành trình, báo giá đoàn hay hỗ trợ khách đang đi tour? Liên hệ qua bất kỳ kênh nào dưới đây."
      />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ icon: Icon, title, value, note, href }) => {
            const content = (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{title}</p>
                <p className="mt-1 font-heading text-[15px] font-bold leading-snug text-ink">{value}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{note}</p>
              </>
            );
            return href ? (
              <a
                key={title}
                href={href}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                {content}
              </a>
            ) : (
              <div key={title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
                {content}
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <h2 className="font-heading text-lg font-extrabold text-ink">Câu hỏi thường gặp</h2>
            <Accordion type="single" collapsible className="mt-3">
              {FAQS.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q} className="border-slate-100">
                  <AccordionTrigger className="py-3.5 text-left text-[14px] font-semibold text-ink hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13.5px] leading-relaxed text-slate-600">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-brand p-6 text-white sm:p-8">
            <div className="topo-pattern pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Giờ làm việc</p>
              <h2 className="mt-2 font-heading text-xl font-extrabold">Đồng hành cùng bạn mọi hành trình</h2>
              <ul className="mt-5 space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Clock4 className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                  Thứ Hai – Thứ Sáu: 8:00 – 21:00
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock4 className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                  Thứ Bảy – Chủ Nhật: 8:00 – 18:00
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                  Đường dây khẩn cấp cho khách đang đi tour: 0912 345 678 (24/7)
                </li>
              </ul>
              <a
                href="tel:19006789"
                className="mt-6 inline-flex h-12 items-center rounded-xl bg-cta px-6 text-sm font-semibold text-white transition hover:bg-cta-hover"
              >
                Gọi ngay 1900 6789
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}