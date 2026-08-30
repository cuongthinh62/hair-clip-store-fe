import { ZALO_CONTACT_URL } from "@/lib/site";
import { ZaloIcon } from "./ZaloButton";

export function FloatingZaloButton() {
  return (
    <a
      href={ZALO_CONTACT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nhắn tin với Thịnh Phát"
      className="group fixed right-4 bottom-20 z-40 flex items-center gap-3 sm:bottom-6"
    >
      <span className="pointer-events-none hidden rounded-full bg-card px-3 py-2 text-xs font-medium text-foreground shadow-soft transition-opacity duration-300 group-hover:opacity-100 sm:block sm:opacity-0">
        Nhắn tin với Thịnh Phát
      </span>
      <span className="zalo-pulse flex h-13 w-13 items-center justify-center rounded-full bg-zalo text-zalo-foreground shadow-lift transition-transform duration-300 group-hover:scale-105">
        <ZaloIcon className="h-6 w-6" />
      </span>
    </a>
  );
}
