import { Link } from "@tanstack/react-router";
import { Compass, Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

const COLUMNS = [
  {
    title: "Khám phá",
    links: [
      { label: "Tour trong nước", to: "/tours", search: { scope: "domestic" } },
      { label: "Tour quốc tế", to: "/tours", search: { scope: "international" } },
      { label: "Tour nghỉ dưỡng", to: "/tours", search: { category: "Nghỉ dưỡng" } },
      { label: "Tour khám phá", to: "/tours", search: { category: "Khám phá" } },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Liên hệ & tư vấn", to: "/lien-he" },
      { label: "Cẩm nang du lịch", to: "/cam-nang" },
      { label: "Chính sách bảo mật", to: "/chinh-sach" },
      { label: "Điều khoản sử dụng", to: "/chinh-sach" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-slate-300">
      <div className="topo-pattern pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
                <Compass className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="font-heading text-xl font-extrabold tracking-tight text-white">
                Gen<span className="text-[#5EC8BC]">Travel</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Mạng lưới bán tour GenTravel kết nối bạn với những hành trình tuyển chọn trong nước và quốc tế,
              giá minh bạch và đội ngũ tư vấn đồng hành 24/7.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-brand hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} search={link.search} className="text-slate-400 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-white">Liên hệ</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#5EC8BC]" />
                <a href="tel:19006789" className="text-slate-300 transition hover:text-white">
                  1900 6789 (8:00 – 21:00)
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#5EC8BC]" />
                <a href="mailto:hotro@gentravel.vn" className="text-slate-300 transition hover:text-white">
                  hotro@gentravel.vn
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#5EC8BC]" />
                <span className="text-slate-400">Tòa nhà Bitexco, 2 Hải Triều, Quận 1, TP. Hồ Chí Minh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 GenTravel Package Tour Sales Network. Bản quyền được bảo hộ.</p>
          <p>Giấy phép kinh doanh lữ hành quốc tế số 01-1234/2024/TCDL-GP LHQT</p>
        </div>
      </div>
    </footer>
  );
}