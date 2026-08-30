import { createFileRoute } from "@tanstack/react-router";

import { CTASection } from "@/components/CTASection";
import { CategoryCard } from "@/components/CategoryCard";
import { SectionHeader } from "@/components/SectionHeader";
import { catalogService } from "@/services/catalog";

export const Route = createFileRoute("/danh-muc")({
  loader: async () => {
    const [categories, products] = await Promise.all([
      catalogService.listCategories(),
      catalogService.listProducts({ limit: 100 }),
    ]);
    return { categories, products };
  },
  head: () => ({
    meta: [
      { title: "Danh mục kẹp tóc & phụ kiện — Thịnh Phát" },
      {
        name: "description",
        content:
          "Các danh mục kẹp tóc của Thịnh Phát: kẹp càng cua, kẹp nơ, kẹp bấm, mẫu tối giản, mẫu dễ thương và phụ kiện tóc khác.",
      },
      { property: "og:title", content: "Danh mục kẹp tóc & phụ kiện — Thịnh Phát" },
      {
        property: "og:description",
        content: "Xem các nhóm sản phẩm kẹp tóc và phụ kiện tóc theo từng danh mục.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { categories, products } = Route.useLoaderData();

  return (
    <div className="pb-24">
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:pt-16">
        <SectionHeader
          align="left"
          eyebrow="Danh mục"
          title="Khám phá theo từng nhóm sản phẩm"
          subtitle="Chọn một danh mục để xem toàn bộ mẫu kẹp tóc thuộc nhóm đó."
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id}>
              <CategoryCard category={c} />
              <p className="mt-2 px-1 text-xs text-muted-foreground">
                {products.filter((p) => p.category === c.slug).length} sản phẩm
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-20">
        <CTASection />
      </div>
    </div>
  );
}
