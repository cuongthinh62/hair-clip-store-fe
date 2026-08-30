import { createFileRoute, Link } from "@tanstack/react-router";

import { CTASection } from "@/components/CTASection";
import { CategoryCard } from "@/components/CategoryCard";
import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { catalogService } from "@/services/catalog";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [featured, categories] = await Promise.all([
      catalogService.getFeatured(8),
      catalogService.listCategories(),
    ]);
    return { featured, categories };
  },
  head: () => ({
    meta: [
      { title: "Thịnh Phát — Kẹp Tóc & Phụ Kiện Tóc Đa Dạng" },
      {
        name: "description",
        content:
          "Khám phá bộ sưu tập kẹp tóc, kẹp nơ, kẹp bấm và phụ kiện tóc của Thịnh Phát. Xem chi tiết mẫu và nhắn Zalo để đặt hàng nhanh.",
      },
      { property: "og:title", content: "Thịnh Phát — Kẹp Tóc & Phụ Kiện Tóc Đa Dạng" },
      {
        property: "og:description",
        content:
          "Bộ sưu tập kẹp tóc và phụ kiện tóc đa dạng. Nhắn Zalo để được tư vấn và đặt hàng.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { featured, categories } = Route.useLoaderData();

  return (
    <div className="pb-24">
      <HeroSection />

      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <SectionHeader
          eyebrow="Danh mục"
          title="Chọn theo kiểu kẹp bạn thích"
          subtitle="Mỗi danh mục gồm nhiều mẫu với kiểu dáng, chất liệu và màu sắc khác nhau."
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHeader
          eyebrow="Nổi bật"
          title="Mẫu kẹp tóc được yêu thích"
          subtitle="Những mẫu được nhiều khách hàng của Thịnh Phát lựa chọn nhất."
        />
        <div className="mt-10">
          <ProductGrid products={featured} />
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/san-pham"
            search={{ danh_muc: undefined }}
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-medium text-foreground transition-colors hover:bg-cream"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>

      <div className="pt-20">
        <CTASection />
      </div>
    </div>
  );
}
