import { BadgeCheck, Clock4, Map, RotateCcw, Users } from "lucide-react";

const REASONS = [
  {
    icon: BadgeCheck,
    title: "Giá hợp lý, rõ ràng",
    description: "Báo giá minh bạch từng khoản, không phát sinh ẩn, đúng tầm trung mà vẫn trọn vẹn dịch vụ.",
  },
  {
    icon: Clock4,
    title: "Hỗ trợ 24/7",
    description: "Chuyên viên trực hotline và Zalo suốt hành trình, kể cả ngày lễ và cuối tuần.",
  },
  {
    icon: RotateCcw,
    title: "Hủy linh hoạt",
    description: "Hoàn 100% tiền cọc khi hủy trước 15 ngày khởi hành theo điều kiện tour.",
  },
  {
    icon: Map,
    title: "Dịch vụ chỉn chu, nhất quán",
    description: "Mọi hành trình được kiểm duyệt theo cùng một tiêu chuẩn, để trải nghiệm luôn trọn vẹn như lần đầu.",
  },
];

const AUDIENCES = ["Gia đình có trẻ nhỏ", "Cặp đôi", "Nhóm bạn", "Đoàn công ty"];

export default function WhyChooseUs() {
  return (
    <section className="bg-cloud py-16 sm:py-20" aria-labelledby="why-gentravel">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Vì sao chọn GenTravel</p>
            <h2 id="why-gentravel" className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              An tâm từ lúc đặt chỗ đến khi về nhà
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Chúng tôi thiết kế hành trình cho cả gia đình có trẻ nhỏ, cặp đôi, nhóm bạn và đoàn công ty. Mỗi nhóm
              khách có một cách tư vấn riêng để chuyến đi vừa vặn nhất, với cùng một chuẩn dịch vụ chỉn chu.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {AUDIENCES.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-white px-3 py-1.5 text-[12px] font-medium text-brand"
                >
                  <Users className="h-3.5 w-3.5" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {REASONS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}