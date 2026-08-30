import type { SiteConfig, ZaloProductContext } from "@/types";

/**
 * Cấu hình thông tin liên hệ của shop.
 *
 * Khi shop đổi số điện thoại / Zalo,
 * chỉ cần thay đổi các giá trị ở đây.
 */
export const SITE: SiteConfig = {
  name: "THỊNH PHÁT",
  tagline: "Kẹp Tóc & Phụ Kiện",

  // Số điện thoại liên hệ
  phone: "0966538356",

  // Facebook
  facebookUrl: "https://www.facebook.com/share/1EcWAscx3Z/?mibextid=wwXIfr",

  // Số điện thoại Zalo
  zaloPhone: "0966538356",
} as const;

/**
 * Link Zalo cá nhân của shop.
 *
 * Kết quả:
 * https://zalo.me/0333681660
 */
export const ZALO_CONTACT_URL = `https://zalo.me/${SITE.zaloPhone}`;

/**
 * Tạo link Zalo.
 *
 * Trường hợp 1:
 * Không truyền product
 * → Mở contact Zalo của Thịnh Phát.
 *
 * Trường hợp 2:
 * Có product
 * → Mở contact Zalo và tạo nội dung tin nhắn
 * liên quan đến sản phẩm.
 */
export function buildZaloUrl(product?: ZaloProductContext): string {
  // Không có sản phẩm
  if (!product) {
    return ZALO_CONTACT_URL;
  }

  // Nội dung tin nhắn gợi ý
  const message = `Xin chào Thịnh Phát, tôi đang quan tâm đến sản phẩm ${product.name} - Mã sản phẩm: ${product.productCode}. Tôi muốn hỏi thêm thông tin và số lượng.`;

  // Encode nội dung để đưa vào URL
  return `${ZALO_CONTACT_URL}?text=${encodeURIComponent(message)}`;
}

/**
 * Định dạng giá tiền VND hiển thị thân thiện.
 */
export function formatPrice(price?: number): string {
  if (price == null) {
    return "Liên hệ";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}
