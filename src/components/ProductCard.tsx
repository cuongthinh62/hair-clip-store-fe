import { Link } from "@tanstack/react-router";
import { getCategoryName } from "@/data/categories";
import { formatPrice } from "@/lib/site";
import type { Product } from "@/types";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.price &&
    product.discountPrice < product.price;

  return (
    <Link
      to="/san-pham/$slug"
      params={{ slug: product.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:rounded-2xl sm:duration-500"
    >
      {/* Image */}
      <div className="aspect-square w-full overflow-hidden bg-cream">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:duration-700"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-2.5 sm:gap-1.5 sm:p-4">
        {/* Category */}
        <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-rose sm:text-[11px] sm:tracking-[0.14em]">
          {product.categoryName || getCategoryName(product.category)}
        </p>

        {/* Product name */}
        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-foreground sm:text-base">
          {product.name}
        </h3>

        {/* Product code */}
        <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
          Mã: {product.productCode}
        </p>

        {/* Description - chỉ hiện trên desktop */}
        <p className="hidden text-xs leading-relaxed text-muted-foreground sm:line-clamp-2">
          {product.description}
        </p>

        {/* Bottom */}
        <div className="mt-auto flex flex-col gap-2 pt-2.5 sm:flex-row sm:items-end sm:justify-between sm:pt-3">
          {/* Price */}
          <div className="min-w-0">
            {hasDiscount ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
                <span className="text-xs font-bold text-rose sm:text-sm">
                  {formatPrice(product.discountPrice)}
                </span>

                <span className="text-[10px] text-muted-foreground line-through sm:text-xs">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-foreground sm:text-sm">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Detail */}
          <span className="self-end whitespace-nowrap text-[10px] font-medium text-rose transition-transform duration-300 group-hover:translate-x-0.5 sm:text-xs">
            Xem chi tiết →
          </span>
        </div>
      </div>
    </Link>
  );
}
