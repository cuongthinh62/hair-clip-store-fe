import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterOption } from "@/types";

export type { FilterOption };

export interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ProductSearch({
  value,
  onChange,
  placeholder = "Tìm kiếm sản phẩm...",
  className,
}: ProductSearchProps) {
  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Tìm kiếm sản phẩm"
        className="h-12 w-full rounded-full border border-input bg-card pr-4 pl-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-rose focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      />
    </div>
  );
}

export interface ProductFilterProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ProductFilter({ options, value, onChange, className }: ProductFilterProps) {
  return (
    <div
      className={cn(
        "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-all duration-300",
            value === o.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-rose hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

