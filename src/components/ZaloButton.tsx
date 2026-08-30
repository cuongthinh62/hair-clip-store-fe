import { buildZaloUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { ZaloProductContext } from "@/types";

export interface ZaloIconProps {
  className?: string;
}

export function ZaloIcon({ className }: ZaloIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
      fill="currentColor"
    >
      <path d="M12 2C6.477 2 2 5.94 2 10.8c0 2.78 1.47 5.25 3.77 6.87-.13.98-.6 2.5-1.3 3.55-.2.3.09.68.43.56 1.9-.66 3.4-1.6 4.2-2.2.9.17 1.85.27 2.9.27 5.523 0 10-3.94 10-8.8S17.523 2 12 2Z" />
    </svg>
  );
}

export type ZaloButtonSize = "sm" | "md" | "lg";

export type ZaloButtonVariant = "zalo" | "outline";

const sizes: Record<ZaloButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

const variants: Record<ZaloButtonVariant, string> = {
  zalo: "bg-zalo text-zalo-foreground hover:brightness-110 shadow-soft",
  outline: "border border-border bg-card text-foreground hover:bg-cream",
};

export interface ZaloButtonProps {
  product?: ZaloProductContext;
  label?: string;
  size?: ZaloButtonSize;
  variant?: ZaloButtonVariant;
  className?: string;
}

export function ZaloButton({
  product,
  label = "Nhắn Zalo",
  size = "md",
  variant = "zalo",
  className,
}: ZaloButtonProps) {
  const zaloUrl = buildZaloUrl(product);

  return (
    <a
      href={zaloUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        sizes[size],
        variants[variant],
        className,
      )}
    >
      <ZaloIcon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />

      {label}
    </a>
  );
}
