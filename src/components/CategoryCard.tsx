import { Link } from "@tanstack/react-router";
import type { Category } from "@/types";

export interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to="/san-pham"
      search={{ danh_muc: category.slug }}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="aspect-4/3 overflow-hidden bg-cream">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">{category.name}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {category.description}
        </p>
      </div>
    </Link>
  );
}

