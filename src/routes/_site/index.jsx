import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/home/HeroSection";
import FeaturedTours from "@/components/home/FeaturedTours";
import DestinationGrid from "@/components/home/DestinationGrid";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import GuideTeaser from "@/components/home/GuideTeaser";
import CtaBand from "@/components/home/CtaBand";
import { getPosts, getTours } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/")({
  loader: async () => {
    const [tours, posts] = await Promise.all([getTours(), getPosts()]);
    return { tours, posts };
  },
  head: () => ({
    meta: [
      { title: "GenTravel – Mạng lưới bán tour trong nước & quốc tế uy tín" },
      {
        name: "description",
        content:
          "Đặt tour trong nước và quốc tế cùng GenTravel: hành trình tuyển chọn, giá hợp lý minh bạch, hỗ trợ 24/7 và hủy linh hoạt.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { tours, posts } = Route.useLoaderData();
  const featured = tours.filter((tour) => tour.is_featured).slice(0, 6);
  const destinations = [...new Set(tours.map((tour) => tour.destination))];

  return (
    <>
      <HeroSection destinations={destinations} />
      <FeaturedTours tours={featured} />
      <DestinationGrid />
      <WhyChooseUs />
      <GuideTeaser posts={posts} />
      <CtaBand />
    </>
  );
}