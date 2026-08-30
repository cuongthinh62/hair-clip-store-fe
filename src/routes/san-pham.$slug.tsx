import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { ProductGallery } from "@/components/ProductGallery";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { ZaloButton } from "@/components/ZaloButton";
import { getCategoryName } from "@/data/categories";
import { formatPrice } from "@/lib/site";
import { catalogService } from "@/services/catalog";

export const Route = createFileRoute("/san-pham/$slug")({
  loader: async ({ params }) => {
    const product = await catalogService.getProduct(params.slug);
    if (!product) throw notFound();
    const related = await catalogService.getRelated(product, 4);
    return { product, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Không tìm thấy sản phẩm — Thịnh Phát" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — Thịnh Phát`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
      ],
    };
  },
  component: ProductDetail,
  errorComponent: DetailError,
  notFoundComponent: DetailNotFound,
});

function DetailNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Không tìm thấy sản phẩm</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Sản phẩm này có thể đã được đổi tên hoặc không còn hiển thị.
      </p>
      <Link
        to="/san-pham"
        search={{ danh_muc: undefined }}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
      >
        Xem sản phẩm khác
      </Link>
    </div>
  );
}

function DetailError() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Không tải được sản phẩm</h1>
      <p className="mt-3 text-sm text-muted-foreground">Bạn thử tải lại trang nhé.</p>
    </div>
  );
}

function ProductDetail() {
  const { product, related } = Route.useLoaderData();

  const displayCategory = product.categoryName || getCategoryName(product.category);

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-rose">
            Trang chủ
          </Link>
          <span className="px-2">/</span>
          <Link to="/san-pham" search={{ danh_muc: undefined }} className="hover:text-rose">
            Sản phẩm
          </Link>
          <span className="px-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-8 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="eyebrow">{displayCategory}</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Mã sản phẩm: {product.productCode}</p>

          <div className="mt-5 flex items-baseline gap-3">
            {product.discountPrice &&
            product.discountPrice > 0 &&
            product.price &&
            product.discountPrice < product.price ? (
              <>
                <span className="text-2xl font-semibold text-rose sm:text-3xl">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-foreground sm:text-3xl">
                {formatPrice(product.price)}
              </span>
            )}
            {product.wholesalePrice && product.wholesalePrice > 0 && (
              <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-rose">
                Giá sỉ từ {formatPrice(product.wholesalePrice)}
              </span>
            )}
          </div>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <dl className="mt-8 grid gap-4 rounded-2xl border border-border/70 bg-cream/60 p-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Chất liệu</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{product.material}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                Kích thước / Dịp dùng
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {product.occasion ? product.occasion : product.size}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Màu sắc</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground"
                  >
                    {c}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <ZaloButton
              size="lg"
              label="Nhắn Zalo để đặt sản phẩm này"
              product={{ name: product.name, productCode: product.productCode }}
              className="w-full sm:w-auto"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Tin nhắn sẽ tự động kèm tên và mã sản phẩm để shop tư vấn nhanh hơn.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHeader align="left" eyebrow="Gợi ý" title="Sản phẩm liên quan" />
        <div className="mt-8">
          <ProductGrid products={related} />
        </div>
      </section>
    </div>
  );
}
