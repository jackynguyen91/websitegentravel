// Nội dung khởi tạo cho cơ sở dữ liệu GenTravel (seed).
import { IMAGES as IMG } from "./images";

export const SAMPLE_TOURS = [
  {
    slug: "phu-quoc-thien-duong-nang-vang",
    title: "Phú Quốc – Thiên Đường Nắng Vàng",
    destination: "Phú Quốc",
    region: "Miền Nam",
    scope: "domestic",
    category: "Nghỉ dưỡng",
    duration_days: 3,
    duration_nights: 2,
    price_adult: 3890000,
    price_child: 2290000,
    discount_percent: 15,
    cover_image: IMG.phuQuoc,
    gallery_images: [IMG.phuQuoc, IMG.island, IMG.food],
    departure_point: "TP. Hồ Chí Minh",
    is_featured: true,
    rating: 4.8,
    review_count: 214,
    suitable_for: ["Gia đình có trẻ nhỏ", "Cặp đôi"],
    highlights: [
      "Cano khám phá 4 đảo phía Nam và lặn ngắm san hô tại Hòn Mây Rút",
      "Đón hoàng hôn tại Sunset Sanato Beach Club",
      "Trải nghiệm cáp treo Hòn Thơm dài nhất thế giới",
      "Tiệc buffet hải sản tại chợ đêm Dinh Cậu",
    ],
    route: [
      {
        day: 1,
        title: "Sài Gòn – Phú Quốc – Sunset Sanato",
        description:
          "Xe đưa đoàn ra sân bay Tân Sơn Nhất, bay đến Phú Quốc. Nhận phòng khách sạn 4* tại Bãi Trường, dùng bữa trưa hải sản. Chiều tự do tắm biển, 17h30 di chuyển đến Sunset Sanato ngắm hoàng hôn và chụp ảnh cùng cây cầu gỗ nổi tiếng.",
      },
      {
        day: 2,
        title: "Tour cano 4 đảo – Làng chài Hàm Ninh",
        description:
          "Khởi hành từ cảng An Thới, cano đưa đoàn qua Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút. Lặn ngắm san hô, câu cá và dùng bữa trưa trên đảo. Chiều ghé làng chài Hàm Ninh thưởng thức ghẹ hấp và ngắm toàn cảnh đảo từ Dinh Cậu.",
      },
      {
        day: 3,
        title: "Chợ đêm Dinh Cậu – về Sài Gòn",
        description:
          "Buổi sáng tự do nghỉ dưỡng tại hồ bơi hoặc mua sắm đặc sản tại chợ Dương Đông. Trả phòng, ra sân bay về Sài Gòn. Kết thúc hành trình, xe đưa đoàn về điểm hẹn ban đầu.",
      },
    ],
    included_services: [
      "Vé máy bay khứ hồi Sài Gòn – Phú Quốc (7kg hành lý xách tay)",
      "Khách sạn 4* trung tâm, 2 khách/phòng",
      "Xe đưa đón và hướng dẫn viên suốt tuyến",
      "3 bữa sáng, 2 bữa trưa, 1 bữa tối",
      "Vé tham quan và bảo hiểm du lịch",
    ],
    excluded_services: [
      "Chi phí cá nhân và đồ uống ngoài chương trình",
      "Phụ thu phòng đơn 1.200.000₫/đêm",
      "Tiền tip cho hướng dẫn viên và tài xế",
    ],
  },
  {
    slug: "ha-giang-song-nho-que-huyen-thoai",
    title: "Hà Giang – Sông Nho Quế Huyền Thoại",
    destination: "Hà Giang",
    region: "Miền Bắc",
    scope: "domestic",
    category: "Khám phá",
    duration_days: 4,
    duration_nights: 3,
    price_adult: 5250000,
    price_child: 3150000,
    discount_percent: 10,
    cover_image: IMG.haGiang,
    gallery_images: [IMG.haGiang, IMG.valley, IMG.food],
    departure_point: "Hà Nội",
    is_featured: true,
    rating: 4.9,
    review_count: 186,
    suitable_for: ["Nhóm bạn", "Cặp đôi"],
    highlights: [
      "Chinh phục đèo Mã Pí Lèng, một trong tứ đại đỉnh đèo của Việt Nam",
      "Thuyền du ngoạn hẻm vực Tu Sản trên sông Nho Quế",
      "Chạm tay cột cờ Lũng Cú, điểm cực Bắc Tổ quốc",
      "Check-in sống lưng khủng long tại xã Pả Vi",
    ],
    route: [
      {
        day: 1,
        title: "Hà Nội – Hà Giang – Quản Bạ",
        description:
          "Xe giường nằm đón đoàn tại phố cổ, khởi hành đi Hà Giang. Dừng chân tại TP. Hà Giang ăn sáng, nhận xe và di chuyển lên Quản Bạ. Chiều tham quan Cổng Trời Quản Bản, núi Đôi Cô Tiên, nhận phòng homestay và dùng bữa tối cùng rượu ngô bản địa.",
      },
      {
        day: 2,
        title: "Yên Minh – Sủng Là – Lũng Cú – Đồng Văn",
        description:
          "Rời Quản Bạ, đoàn đi qua rừng thông Yên Minh, ghé dinh thự họ Vương tại Sủng Là và cột cờ Lũng Cú. Chiều tiếp tục đến Đồng Văn, dạo phố cổ và dùng bữa tối với món cháo ấu tẩu đặc trưng của cao nguyên đá.",
      },
      {
        day: 3,
        title: "Mã Pí Lèng – Sông Nho Quế – Mèo Vạc",
        description:
          "Sáng sớm chinh phục đèo Mã Pí Lèng, ngắm toàn cảnh hẻm vực Tu Sản. Xuống bến thuyền, du ngoạn hẻm vực trên sông Nho Quế trong 2 giờ. Chiều di chuyển đến Mèo Vạc, tham quan chợ phiên và nghỉ đêm tại homestay nhìn ra thung lũng.",
      },
      {
        day: 4,
        title: "Mèo Vạc – Hà Nội",
        description:
          "Trả phòng, ngược về TP. Hà Giang theo cung đường Pả Vi với sống lưng khủng long nổi tiếng. Dùng bữa trưa tại thành phố, lên xe giường nằm về Hà Nội, kết thúc hành trình vào khoảng 19h.",
      },
    ],
    included_services: [
      "Xe giường nằm khứ hồi Hà Nội – Hà Giang",
      "Homestay và khách sạn tại Quản Bạ, Đồng Văn, Mèo Vạc",
      "Xe máy hoặc ô tô 7 chỗ theo lịch trình kèm tay lái địa phương",
      "Hướng dẫn viên, thuyền du ngoạn sông Nho Quế",
      "4 bữa sáng, 4 bữa chính và bảo hiểm du lịch",
    ],
    excluded_services: [
      "Vé tham quan cột cờ Lũng Cú và dinh thự họ Vương",
      "Đồ uống và chi phí cá nhân",
      "Tiền tip cho hướng dẫn viên và tay lái",
    ],
  },
  {
    slug: "da-lat-san-may-dinh-hon-bo",
    title: "Đà Lạt – Săn Mây Đỉnh Hòn Bồ",
    destination: "Đà Lạt",
    region: "Miền Trung",
    scope: "domestic",
    category: "Tour trong nước",
    duration_days: 3,
    duration_nights: 2,
    price_adult: 2690000,
    price_child: 1590000,
    discount_percent: 12,
    cover_image: IMG.daLat,
    gallery_images: [IMG.daLat, IMG.valley, IMG.food],
    departure_point: "TP. Hồ Chí Minh",
    is_featured: true,
    rating: 4.7,
    review_count: 302,
    suitable_for: ["Gia đình có trẻ nhỏ", "Cặp đôi"],
    highlights: [
      "Săn mây bình minh trên đỉnh Hòn Bồ với trọn biển mây",
      "Ghé đồi chè Cầu Đất và nông trại dâu tây công nghệ cao",
      "Dạo chợ đêm Đà Lạt, thưởng thức sữa đậu nành nóng",
      "Check-in đồi cỏ hồng và hồ Tuyền Lâm",
    ],
    route: [
      {
        day: 1,
        title: "Sài Gòn – Đà Lạt – Hồ Tuyền Lâm",
        description:
          "Xe giường nằm đón đoàn tại trung tâm Sài Gòn, di chuyển đến Đà Lạt theo cao tốc Liên Khương. Nhận phòng khách sạn gần hồ Xuân Hương, dùng bữa trưa. Chiều tham quan thiền viện Trúc Lâm, hồ Tuyền Lâm và thưởng thức cà phê ngắm hoàng hôn.",
      },
      {
        day: 2,
        title: "Săn mây Hòn Bồ – Đồi chè Cầu Đất",
        description:
          "Đoàn khởi hành 4h30 lên đỉnh Hòn Bồ đón bình minh và săn mây. Về lại thành phố ăn sáng, sau đó đi đồi chè Cầu Đất, thung lũng Đất Sét và nông trại dâu tây. Tối tự do dạo chợ đêm, thử bánh tráng nướng và sữa đậu nành.",
      },
      {
        day: 3,
        title: "Đồi cỏ hồng – về Sài Gòn",
        description:
          "Buổi sáng check-in đồi cỏ hồng và quảng trường Lâm Viên, mua đặc sản tại chợ Đà Lạt. Trả phòng, xe đưa đoàn về Sài Gòn, kết thúc chương trình.",
      },
    ],
    included_services: [
      "Xe giường nằm khứ hồi Sài Gòn – Đà Lạt",
      "Khách sạn 3* trung tâm, 2 khách/phòng",
      "Xe đưa đón và hướng dẫn viên theo lịch trình",
      "Vé tham quan các điểm trong chương trình",
      "3 bữa sáng, 2 bữa trưa và bảo hiểm du lịch",
    ],
    excluded_services: [
      "Chi phí cá nhân, đồ uống và vé các điểm tự do",
      "Phụ thu phòng đơn 800.000₫/đêm",
      "Tiền tip cho hướng dẫn viên",
    ],
  },
  {
    slug: "nhat-ban-mua-hoa-anh-dao-cung-duong-vang",
    title: "Nhật Bản – Mùa Hoa Anh Đào Cung Đường Vàng",
    destination: "Nhật Bản",
    region: "Quốc tế",
    scope: "international",
    category: "Tour quốc tế",
    duration_days: 6,
    duration_nights: 5,
    price_adult: 35900000,
    price_child: 28900000,
    discount_percent: 8,
    cover_image: IMG.nhatBan,
    gallery_images: [IMG.nhatBan, IMG.blogCulture, IMG.food],
    departure_point: "Hà Nội",
    is_featured: true,
    rating: 4.9,
    review_count: 96,
    suitable_for: ["Gia đình có trẻ nhỏ", "Cặp đôi", "Đoàn công ty"],
    highlights: [
      "Hành trình Tokyo – Fuji – Kyoto – Osaka mùa hoa anh đào",
      "Ngắm núi Phú Sĩ từ hồ Kawaguchiko và làng cổ Oshino Hakkai",
      "Dạo bước dưới rừng trúc Arashiyama và đền Fushimi Inari",
      "Trải nghiệm tàu Shinkansen và ẩm thực đường phố Dotonbori",
    ],
    route: [
      {
        day: 1,
        title: "Hà Nội – Tokyo",
        description:
          "Đoàn tập trung tại sân bay Nội Bài, làm thủ tục bay đến Tokyo. Về khách sạn tại khu Shinjuku, nghỉ ngơi sau chuyến bay dài.",
      },
      {
        day: 2,
        title: "Tokyo – Asakusa – Shibuya",
        description:
          "Tham quan đền Sensoji và phố Nakamise, dùng bữa trưa với mì ramen. Chiều ghé đài truyền hình Tokyo Skytree, ngã tư Shibuya và công viên Ueno ngập sắc anh đào.",
      },
      {
        day: 3,
        title: "Núi Phú Sĩ – Hồ Kawaguchiko",
        description:
          "Khởi hành đến vùng Ngũ Hồ, ngắm Phú Sĩ từ bờ hồ Kawaguchiko, tham quan làng cổ Oshino Hakkai. Tối nghỉ tại ryokan với bồn tắm onsen truyền thống.",
      },
      {
        day: 4,
        title: "Kyoto – Arashiyama – Fushimi Inari",
        description:
          "Di chuyển bằng Shinkansen đến Kyoto. Dạo rừng trúc Arashiyama, chiêm bái đền Fushimi Inari với hàng nghìn cổng torii đỏ, ghé phố cổ Gion.",
      },
      {
        day: 5,
        title: "Osaka – Dotonbori",
        description:
          "Tham quan lâu đài Osaka, mua sắm tại Shinsaibashi. Buổi tối tự do khám phá ẩm thực đường phố Dotonbori với takoyaki và okonomiyaki.",
      },
      {
        day: 6,
        title: "Osaka – Hà Nội",
        description:
          "Dùng bữa sáng, ra sân bay Kansai, bay về Hà Nội. Kết thúc hành trình, xe đưa đoàn về điểm hẹn.",
      },
    ],
    included_services: [
      "Vé máy bay khứ hồi Hà Nội – Tokyo / Osaka (hành lý 23kg ký gửi)",
      "Khách sạn 4* trung tâm, 2 khách/phòng",
      "Vé tàu Shinkansen và xe đưa đón theo chương trình",
      "Hướng dẫn viên tiếng Việt suốt tuyến",
      "Bảo hiểm du lịch quốc tế và visa Nhật Bản",
    ],
    excluded_services: [
      "Chi phí cá nhân, đồ uống và mua sắm",
      "Phụ thu phòng đơn 9.500.000₫/toàn tour",
      "Tiền tip cho hướng dẫn viên địa phương",
    ],
  },
  {
    slug: "ha-long-ky-quan-di-san",
    title: "Hạ Long – Kỳ Quan Di Sản",
    destination: "Hạ Long",
    region: "Miền Bắc",
    scope: "domestic",
    category: "Nghỉ dưỡng",
    duration_days: 2,
    duration_nights: 1,
    price_adult: 2190000,
    price_child: 1290000,
    discount_percent: 10,
    cover_image: IMG.haLong,
    gallery_images: [IMG.haLong, IMG.valley, IMG.island],
    departure_point: "Hà Nội",
    is_featured: true,
    rating: 4.6,
    review_count: 258,
    suitable_for: ["Gia đình có trẻ nhỏ", "Đoàn công ty"],
    highlights: [
      "Nghỉ đêm trên du thuyền 4* giữa vịnh Hạ Long",
      "Chèo kayak khám phá hang Luồn và làng chài Vung Viêng",
      "Ngắm hoàng hôn và tập Thái Cực Dương trên boong tàu",
      "Thưởng thức hải sản tươi sống theo thực đơn của đầu bếp",
    ],
    route: [
      {
        day: 1,
        title: "Hà Nội – Hạ Long – Hang Luồn",
        description:
          "Xe đón đoàn tại phố cổ, di chuyển đến cảng Tuần Châu. Lên du thuyền, dùng bữa trưa hải sản khi tàu ra vịnh. Chiều chèo kayak qua hang Luồn, tắm biển tại bãi Ba Trái Đào. Tối dùng tiệc buffet và câu mực trên boong.",
      },
      {
        day: 2,
        title: "Vung Viêng – Hà Nội",
        description:
          "Đón bình minh với lớp Thái Cực Dương, dùng bữa sáng. Tàu ghé làng chài Vung Viêng, tham quan hang Sửng Sốt. Trả phòng, về cảng và di chuyển về Hà Nội, kết thúc chương trình.",
      },
    ],
    included_services: [
      "Xe đưa đón khứ hồi Hà Nội – Hạ Long",
      "Du thuyền 4* với phòng nghỉ riêng có ban công",
      "3 bữa chính và 1 bữa sáng",
      "Kayak, vé tham quan vịnh và phí môi trường",
      "Hướng dẫn viên và bảo hiểm du lịch",
    ],
    excluded_services: [
      "Đồ uống, chi phí cá nhân",
      "Phụ thu phòng đơn 1.500.000₫",
      "Tiền tip cho thủy thủ đoàn",
    ],
  },
  {
    slug: "da-nang-hoi-an-pho-co-lung-linh",
    title: "Đà Nẵng – Hội An: Phố Cổ Lung Linh",
    destination: "Đà Nẵng",
    region: "Miền Trung",
    scope: "domestic",
    category: "Khám phá",
    duration_days: 4,
    duration_nights: 3,
    price_adult: 4450000,
    price_child: 2690000,
    discount_percent: 15,
    cover_image: IMG.daNang,
    gallery_images: [IMG.daNang, IMG.mienTrung, IMG.food],
    departure_point: "Hà Nội",
    is_featured: true,
    rating: 4.8,
    review_count: 341,
    suitable_for: ["Gia đình có trẻ nhỏ", "Cặp đôi", "Nhóm bạn"],
    highlights: [
      "Check-in Cầu Vàng nằm giữa lưng chừng Bà Nà Hills",
      "Thả đèn hoa đăng và dạo phố cổ Hội An về đêm",
      "Tắm biển Mỹ Khê và ngắm bán đảo Sơn Trà",
      "Thưởng thức mì Quảng, cao lầu và bánh mì Phượng",
    ],
    route: [
      {
        day: 1,
        title: "Hà Nội – Đà Nẵng – Bán đảo Sơn Trà",
        description:
          "Bay từ Hà Nội đến Đà Nẵng, nhận phòng khách sạn gần biển Mỹ Khê. Chiều tham quan chùa Linh Ứng, bán đảo Sơn Trà và tượng Phật Quán Thế Âm. Tối tự do dạo cầu Rồng và chợ đêm Sơn Trà.",
      },
      {
        day: 2,
        title: "Bà Nà Hills – Cầu Vàng",
        description:
          "Khởi hành đến Bà Nà Hills, trải nghiệm cáp treo và check-in Cầu Vàng. Vui chơi tại Fantasy Park, dùng buffet trưa. Chiều trở về thành phố, nghỉ ngơi và thưởng thức hải sản tại bãi biển.",
      },
      {
        day: 3,
        title: "Hội An – Phố cổ lung linh",
        description:
          "Di chuyển đến Hội An, tham quan Chùa Cầu, hội quán Phúc Kiến và nhà cổ Tấn Ký. Chiều thử làm đèn lồng, tối dạo phố cổ và thả đèn hoa đăng trên sông Hoài.",
      },
      {
        day: 4,
        title: "Đà Nẵng – Hà Nội",
        description:
          "Buổi sáng tự do tắm biển và mua đặc sản. Ra sân bay Đà Nẵng, bay về Hà Nội, kết thúc chương trình.",
      },
    ],
    included_services: [
      "Vé máy bay khứ hồi Hà Nội – Đà Nẵng (7kg xách tay, 20kg ký gửi)",
      "Khách sạn 4* gần biển Mỹ Khê, 2 khách/phòng",
      "Xe đưa đón và hướng dẫn viên suốt tuyến",
      "Vé Bà Nà Hills, cáp treo và buffet trưa",
      "4 bữa sáng, 2 bữa trưa và bảo hiểm du lịch",
    ],
    excluded_services: [
      "Chi phí cá nhân, đồ uống và vé tham quan ngoài chương trình",
      "Phụ thu phòng đơn 1.100.000₫/đêm",
      "Tiền tip cho hướng dẫn viên",
    ],
  },
];

export const DESTINATIONS = [...new Set(SAMPLE_TOURS.map((tour) => tour.destination))];

export const REGIONS = [
  {
    name: "Miền Bắc",
    tagline: "Núi rừng Tây Bắc & di sản vịnh Hạ Long",
    image: IMG.mienBac,
    count: 28,
    search: { region: "Miền Bắc" },
  },
  {
    name: "Miền Trung",
    tagline: "Biển xanh, phố cổ và cao nguyên mây phủ",
    image: IMG.mienTrung,
    count: 34,
    search: { region: "Miền Trung" },
  },
  {
    name: "Miền Nam",
    tagline: "Đảo ngọc Phú Quốc & miền Tây sông nước",
    image: IMG.phuQuoc,
    count: 22,
    search: { region: "Miền Nam" },
  },
  {
    name: "Quốc tế",
    tagline: "Nhật Bản, Hàn Quốc, Thái Lan & châu Âu",
    image: IMG.nhatBan,
    count: 18,
    search: { scope: "international" },
  },
];

export const SAMPLE_REVIEWS = [
  {
    tour_slug: "phu-quoc-thien-duong-nang-vang",
    customer_name: "Nguyễn Thu Hà",
    rating: 5,
    comment:
      "Gia đình mình đi 4 người, bé 6 tuổi rất thích tour cano 4 đảo. Hướng dẫn viên chăm sóc chu đáo, khách sạn sạch và gần biển.",
    created_date: "2026-10-02",
  },
  {
    tour_slug: "phu-quoc-thien-duong-nang-vang",
    customer_name: "Trần Quốc Bảo",
    rating: 4,
    comment: "Lịch trình hợp lý, đồ ăn ổn. Buổi tối ở chợ đêm hơi đông nhưng rất vui.",
    created_date: "2026-09-18",
  },
  {
    tour_slug: "ha-giang-song-nho-que-huyen-thoai",
    customer_name: "Lê Minh Anh",
    rating: 5,
    comment:
      "Cung đường Mã Pí Lèng đẹp đến nghẹt thở. Tay lái địa phương rất an toàn, homestay ở Mèo Vạc view thung lũng tuyệt vời.",
    created_date: "2026-10-21",
  },
  {
    tour_slug: "ha-giang-song-nho-que-huyen-thoai",
    customer_name: "Phạm Gia Huy",
    rating: 5,
    comment: "Nhóm bạn 6 người đi mùa lúa chín, dịch vụ đúng như mô tả. Sẽ quay lại vào mùa hoa tam giác mạch.",
    created_date: "2026-09-30",
  },
  {
    tour_slug: "da-lat-san-may-dinh-hon-bo",
    customer_name: "Đỗ Khánh Linh",
    rating: 5,
    comment: "Săn mây thành công, biển mây dày đặc lúc 5h30. Xe đón đúng giờ, hướng dẫn viên nhiệt tình.",
    created_date: "2026-10-11",
  },
  {
    tour_slug: "nhat-ban-mua-hoa-anh-dao-cung-duong-vang",
    customer_name: "Vũ Hoàng Nam",
    rating: 5,
    comment:
      "Tour Nhật tổ chức rất chuyên nghiệp, khách sạn trung tâm và di chuyển bằng Shinkansen rất tiện. Anh hướng dẫn viên nói tiếng Nhật tốt.",
    created_date: "2026-04-15",
  },
  {
    tour_slug: "ha-long-ky-quan-di-san",
    customer_name: "Bùi Thanh Trúc",
    rating: 4,
    comment: "Du thuyền sạch, phòng có ban công ngắm vịnh rất đẹp. Bữa tối hải sản tươi.",
    created_date: "2026-10-05",
  },
  {
    tour_slug: "da-nang-hoi-an-pho-co-lung-linh",
    customer_name: "Hoàng Mai Phương",
    rating: 5,
    comment:
      "Cầu Vàng đẹp hơn mong đợi. Phố cổ Hội An về đêm lung linh, cả nhà rất thích hoạt động làm đèn lồng.",
    created_date: "2026-09-27",
  },
];

export const SAMPLE_POSTS = [
  {
    slug: "an-gi-o-ha-noi-10-mon-nhat-dinh-phai-thu",
    title: "Ăn gì ở Hà Nội? 10 món nhất định phải thử",
    thumbnail: IMG.blogFood,
    summary:
      "Từ phở bò phố cổ đến bún chả Hàng Mành, danh sách này giúp bạn ăn trọn hương vị Hà Nội trong 48 giờ.",
    category: "Ẩm thực",
    published_at: "2026-10-28",
    content:
      "Hà Nội không chỉ đẹp ở những con phố rêu phong mà còn chinh phục du khách bằng nền ẩm thực đường phố lâu đời.\n\nBắt đầu ngày mới với bát phở bò nóng hổi ở phố Lò Đúc, nước dùng trong, thịt bò tái mềm và hành lá thơm. Buổi trưa, ghé quán bún chả lâu năm trên phố Hàng Mành, ăn kèm rau sống và nước chấm chua ngọt.\n\nChiều muộn là thời điểm lý tưởng cho bánh mì Hà Nội, bánh cuốn Thanh Trì và bánh tôm Hồ Tây. Nếu còn sức, hãy thử chả cá Lã Vọng và kết thúc bằng cốc cà phê trứng trên phố Nguyễn Hữu Huân.\n\nMẹo nhỏ: các quán ngon thường mở rất sớm và hết hàng trước 21h, nên hãy đến trước giờ cao điểm khoảng 30 phút.",
  },
  {
    slug: "bi-kip-san-may-da-lat-cho-nguoi-moi",
    title: "Bí kíp săn mây Đà Lạt cho người mới",
    thumbnail: IMG.blogTraveler,
    summary:
      "Thời điểm, địa điểm và những lưu ý để chuyến săn mây đầu tiên của bạn thành công trọn vẹn.",
    category: "Kinh nghiệm",
    published_at: "2026-10-15",
    content:
      "Săn mây là trải nghiệm được yêu thích nhất khi đến Đà Lạt, nhưng không phải ai cũng gặp được biển mây đúng nghĩa.\n\nThời điểm lý tưởng là từ tháng 5 đến tháng 10, khi độ ẩm cao và trời ít gió. Bạn cần rời khách sạn từ 4h30 để kịp lên đỉnh trước khi mặt trời mọc.\n\nNhững điểm săn mây quen thuộc gồm đỉnh Hòn Bồ, đồi Đa Phú và cung đường Cầu Đất. Hãy mặc áo khoác dày vì nhiệt độ trên đỉnh có thể xuống dưới 12 độ C.\n\nMột lưu ý quan trọng: nếu trời mưa từ đêm hôm trước, khả năng gặp mây rất cao nhưng đường trơn, nên chọn xe và tay lái có kinh nghiệm.",
  },
  {
    slug: "hoi-an-24-gio-o-pho-co",
    title: "Hội An – 24 giờ ở phố cổ",
    thumbnail: IMG.blogCulture,
    summary:
      "Lịch trình một ngày trọn vẹn từ bữa sáng cao lầu đến đêm thả đèn hoa đăng trên sông Hoài.",
    category: "Điểm đến",
    published_at: "2026-09-22",
    content:
      "Hội An nhỏ bé nhưng đủ sức giữ chân du khách nhiều ngày. Với 24 giờ, bạn vẫn có thể cảm nhận trọn vẹn nhịp sống phố cổ.\n\nBuổi sáng bắt đầu ở chợ Hội An, ăn cao lầu và uống cà phê muối bên bờ sông. Sau đó thuê xe đạp ra bãi biển An Bàng, cách trung tâm khoảng 4km.\n\nBuổi chiều là lúc phố cổ lên đèn. Hãy ghé xưởng làm đèn lồng để tự tay hoàn thiện một chiếc đèn, rồi thả hoa đăng trên sông Hoài khi trời tối hẳn.\n\nĐừng bỏ lỡ món bánh mì Phượng nổi tiếng và một buổi biểu diễn hát bài chòi tại quảng trường đêm.",
  },
];