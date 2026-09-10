import { Link } from "@tanstack/react-router";
import { Facebook, MapPin, Phone } from "lucide-react";

import { SITE, ZALO_CONTACT_URL } from "@/lib/site";
import { ZaloIcon } from "./ZaloButton";

const links = [
  { to: "/", label: "Trang chủ" },
  { to: "/san-pham", label: "Sản phẩm" },
  { to: "/danh-muc", label: "Danh mục" },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/lien-he", label: "Liên hệ" },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="brand-wordmark text-lg text-foreground">{SITE.name}</p>
          <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {SITE.tagline}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Nơi giới thiệu các mẫu kẹp tóc và phụ kiện tóc đa dạng, dễ chọn và dễ liên hệ đặt hàng.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
            Liên kết
          </h3>
          <ul className="mt-4 space-y-3">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-rose"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">Liên hệ</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{SITE.address}</span>
            </li>
            <li>
              <a
                href={ZALO_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-rose"
              >
                <ZaloIcon /> Zalo: {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={`tel:${SITE.zaloPhone}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-rose"
              >
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={SITE.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mở Facebook của Thịnh Phát"
                className="inline-flex items-center gap-2 transition-colors hover:text-rose"
              >
                <span className="facebook-pulse inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-soft">
                  <Facebook className="h-4 w-4" fill="currentColor" />
                </span>
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © 2026 Thịnh Phát. All rights reserved.
      </div>
    </footer>
  );
}
