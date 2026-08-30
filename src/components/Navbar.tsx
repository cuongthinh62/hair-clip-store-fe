import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { SITE } from "@/lib/site";
import { ZaloButton } from "./ZaloButton";

const links = [
  { to: "/", label: "Trang chủ" },
  { to: "/san-pham", label: "Sản phẩm" },
  { to: "/danh-muc", label: "Danh mục" },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/lien-he", label: "Liên hệ" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:py-4">
        <Link to="/" className="min-w-0" onClick={() => setOpen(false)}>
          <span className="brand-wordmark block truncate text-lg text-foreground sm:text-xl">
            {SITE.name}
          </span>
          <span className="block truncate text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {SITE.tagline}
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 lg:gap-6">
          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-rose" }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <ZaloButton size="sm" className="hidden sm:inline-flex" />

          <button
            type="button"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-cream lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-background px-4 pb-5 lg:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: l.to === "/" }}
                  activeProps={{ className: "text-rose" }}
                  className="block border-b border-border/60 py-4 text-base font-medium text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ZaloButton size="lg" className="mt-5 w-full" label="Nhắn Zalo cho Thịnh Phát" />
        </nav>
      ) : null}
    </header>
  );
}
