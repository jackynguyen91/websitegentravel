import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/site/PageHeader";

export const Route = createFileRoute("/_site/chinh-sach")({
  head: () => ({
    meta: [
      { title: "Chính sách bảo mật & Điều khoản – GenTravel" },
      { name: "description", content: "Chính sách bảo mật thông tin và điều khoản sử dụng dịch vụ của GenTravel." },
    ],
  }),
  component: PolicyPage,
});

const SECTIONS = [
  {
    id: "bao-mat",
    title: "Chính sách bảo mật",
    paragraphs: [
      "GenTravel chỉ thu thập những thông tin cần thiết để phục vụ việc đặt tour: họ tên, số điện thoại, email và yêu cầu riêng của quý khách. Thông tin này được dùng để xác nhận đặt chỗ, xuất vé và liên hệ trong suốt hành trình.",
      "Chúng tôi không bán, trao đổi hay chia sẻ dữ liệu khách hàng cho bên thứ ba ngoài các đối tác trực tiếp cung cấp dịch vụ trong tour như hãng bay và khách sạn, và chỉ ở mức tối thiểu cần thiết.",
      "Quý khách có thể yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu cá nhân của mình bất kỳ lúc nào bằng cách gửi email đến hotro@gentravel.vn.",
    ],
  },
  {
    id: "dieu-khoan",
    title: "Điều khoản sử dụng",
    paragraphs: [
      "Khi gửi yêu cầu đặt tour, quý khách chưa thanh toán ngay. Chuyên viên GenTravel sẽ liên hệ xác nhận tình trạng chỗ, giá cuối cùng và hướng dẫn thanh toán trong vòng 30 phút làm việc.",
      "Giá tour hiển thị trên website là giá tham khảo theo mùa và chưa bao gồm các phụ thu ghi rõ trong phần dịch vụ không bao gồm. Giá có thể thay đổi theo tình trạng vé và phòng tại thời điểm xác nhận.",
      "Điều kiện hủy và hoàn tiền áp dụng theo từng tour: hoàn 100% tiền cọc khi hủy trước 15 ngày khởi hành, hoàn 70% khi hủy trước 7 ngày. Trong vòng 7 ngày trước khởi hành, khoản cọc không được hoàn do các dịch vụ đã được giữ chỗ.",
      "GenTravel có thể thay đổi lịch trình vì lý do thời tiết hoặc yêu cầu an toàn, nhưng sẽ đảm bảo các điểm tham quan chính và báo trước cho quý khách.",
    ],
  },
];

function PolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pháp lý"
        title="Chính sách & Điều khoản"
        description="Những cam kết của GenTravel về bảo mật thông tin và điều kiện sử dụng dịch vụ đặt tour."
      />
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <nav className="flex flex-wrap gap-2" aria-label="Mục lục">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
            >
              {section.title}
            </a>
          ))}
        </nav>

        <div className="mt-8 space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <h2 className="font-heading text-xl font-extrabold text-ink">{section.title}</h2>
              <div className="mt-3 space-y-3.5">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-[14.5px] leading-[1.8] text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}