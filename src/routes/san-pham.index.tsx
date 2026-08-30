import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";

import { CTASection } from "@/components/CTASection";
import { ProductFilter, ProductSearch } from "@/components/ProductFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { getCategoryName } from "@/data/categories";
import { catalogService, searchProducts } from "@/services/catalog";
import type { FilterOption } from "@/types";

const productSearchSchema = z.object({
  danh_muc: z.string().optional(),
});

export const Route = createFileRoute("/san-pham/")({
  validateSearch: (search) => productSearchSchema.parse(search),
  loaderDeps: ({ search: { danh_muc } }) => ({ danh_muc }),
  loader: async ({ deps: { danh_muc } }) => {
    const [categories, all] = await Promise.all([
      catalogService.listCategories(),
      catalogService.listProducts({
        ...(danh_muc && danh_muc !== "all" ? { categorySlug: danh_muc } : {}),
        limit: 100,
      }),
    ]);
    return { categories, all };
  },
  head: () => ({
    meta: [
      { title: "Sản phẩm kẹp tóc & phụ kiện — Thịnh Phát" },
      {
        name: "description",
        content:
          "Danh sách đầy đủ các mẫu kẹp tóc và phụ kiện tóc của Thịnh Phát. Tìm kiếm theo tên, mã sản phẩm hoặc lọc theo danh mục.",
      },
      { property: "og:title", content: "Sản phẩm kẹp tóc & phụ kiện — Thịnh Phát" },
      {
        property: "og:description",
        content: "Xem toàn bộ mẫu kẹp tóc, lọc theo danh mục và nhắn Zalo để đặt hàng.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { danh_muc } = Route.useSearch();
  const { categories, all } = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });
  const [query, setQuery] = useState("");

  const active = danh_muc ?? "all";

  const options = useMemo(
    () => [
      { value: "all", label: "Tất cả" },
      ...categories.map((c) => ({ value: c.slug, label: c.name })),
    ],
    [categories],
  );

  const activeCategoryName = useMemo(() => {
    if (active === "all") return "";
    const cat = categories.find((c) => c.slug === active);
    return cat?.name || getCategoryName(active);
  }, [active, categories]);

  const products = useMemo(() => {
    return searchProducts(all, query, (slug) => {
      const cat = categories.find((c) => c.slug === slug);
      return cat?.name || getCategoryName(slug);
    });
  }, [all, categories, query]);

  return (
    <div className="pb-24">
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:pt-16">
        <SectionHeader
          align="left"
          eyebrow="Sản phẩm"
          title="Tất cả mẫu kẹp tóc & phụ kiện"
          subtitle="Chọn danh mục hoặc tìm theo tên, mã sản phẩm để nhanh chóng tìm được mẫu bạn thích."
        />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ProductFilter
            options={options}
            value={active}
            onChange={(v) =>
              navigate({
                search: { danh_muc: v === "all" ? undefined : v },
                resetScroll: false,
              })
            }
          />
          <ProductSearch value={query} onChange={setQuery} />
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Hiển thị {products.length} sản phẩm
          {active !== "all" ? ` trong danh mục ${activeCategoryName}` : ""}.
        </p>

        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      </section>

      <div className="pt-20">
        <CTASection />
      </div>
    </div>
  );
}
