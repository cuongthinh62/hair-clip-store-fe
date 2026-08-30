import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, MapPin, Phone } from "lucide-react";

import { SectionHeader } from "@/components/SectionHeader";
import { ZaloButton, ZaloIcon } from "@/components/ZaloButton";
import { SITE, ZALO_CONTACT_URL } from "@/lib/site";

export const Route = createFileRoute("/lien-he")({
  head: () => ({
    meta: [
      { title: "Liên hệ Thịnh Phát — Đặt hàng qua Zalo" },
      {
        name: "description",
        content:
          "Liên hệ Thịnh Phát qua Zalo, điện thoại hoặc Facebook để được tư vấn mẫu kẹp tóc và chốt đơn nhanh chóng.",
      },
      { property: "og:title", content: "Liên hệ Thịnh Phát" },
      {
        property: "og:description",
        content: "Nhắn Zalo hoặc gọi điện để được Thịnh Phát tư vấn và đặt hàng.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:pt-16">
        <SectionHeader
          align="left"
          eyebrow="Liên hệ"
          title="Nhắn tin cho Thịnh Phát"
          subtitle="Cách nhanh nhất để đặt hàng là nhắn Zalo. Shop sẽ tư vấn màu sắc, số lượng và cách nhận hàng."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
            <h2 className="text-xl font-semibold text-foreground">Thông tin liên hệ</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-rose">
                  <ZaloIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-medium text-foreground">Zalo</span>
                  <a
                    href={ZALO_CONTACT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-rose"
                  >
                    {SITE.phone}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-rose" />
                <span>
                  <span className="block font-medium text-foreground">Điện thoại</span>
                  <a
                    href={`tel:${SITE.zaloPhone}`}
                    className="text-muted-foreground transition-colors hover:text-rose"
                  >
                    {SITE.phone}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Facebook className="mt-0.5 h-5 w-5 text-rose" />
                <span>
                  <span className="block font-medium text-foreground">Facebook</span>
                  <a
                    href={SITE.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-rose"
                  >
                    Trang Facebook của Thịnh Phát
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-rose" />
                <span>
                  <span className="block font-medium text-foreground">Thời gian phản hồi</span>
                  <span className="text-muted-foreground">Thứ 2 – Chủ nhật, 8:00 – 21:00</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-rose" />
                <span>
                  <span className="block font-medium text-foreground">Hình thức bán</span>
                  <span className="text-muted-foreground">
                    Bán online, giao hàng toàn quốc qua đơn vị vận chuyển.
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-border/70 bg-beige p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-foreground">Đặt hàng trong 3 bước</h2>
            <ol className="mt-6 space-y-5 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card text-xs font-semibold text-foreground">
                  1
                </span>
                Chọn mẫu kẹp tóc bạn thích trong trang sản phẩm và ghi lại mã sản phẩm.
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card text-xs font-semibold text-foreground">
                  2
                </span>
                Nhấn nút Zalo — tin nhắn sẽ tự động kèm tên và mã sản phẩm.
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card text-xs font-semibold text-foreground">
                  3
                </span>
                Shop xác nhận màu sắc, số lượng, phí giao hàng và gửi đơn cho bạn.
              </li>
            </ol>
            <ZaloButton size="lg" label="Nhắn Zalo ngay" className="mt-8 w-full sm:w-auto" />
          </div>
        </div>
      </section>
    </div>
  );
}
