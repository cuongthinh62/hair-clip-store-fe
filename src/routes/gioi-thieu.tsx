import { createFileRoute } from "@tanstack/react-router";
import { Gem, HeartHandshake, Sparkles } from "lucide-react";

import aboutImage from "@/assets/about.jpg";
import { CTASection } from "@/components/CTASection";
import { SectionHeader } from "@/components/SectionHeader";

const values = [
  {
    icon: Sparkles,
    title: "Mẫu mã đa dạng",
    text: "Nhiều kiểu dáng từ tối giản đến dễ thương, cập nhật theo xu hướng.",
  },
  {
    icon: Gem,
    title: "Chất liệu chọn lọc",
    text: "Kẹp được chọn kỹ về độ bền, độ bám và cảm giác khi sử dụng.",
  },
  {
    icon: HeartHandshake,
    title: "Tư vấn thân thiện",
    text: "Nhắn Zalo là được hỗ trợ ngay, không cần tài khoản hay giỏ hàng.",
  },
];

export const Route = createFileRoute("/gioi-thieu")({
  head: () => ({
    meta: [
      { title: "Giới thiệu về Thịnh Phát — Kẹp Tóc & Phụ Kiện" },
      {
        name: "description",
        content:
          "Thịnh Phát là nơi giới thiệu các mẫu kẹp tóc và phụ kiện tóc chọn lọc, với cách đặt hàng đơn giản qua Zalo.",
      },
      { property: "og:title", content: "Giới thiệu về Thịnh Phát" },
      {
        property: "og:description",
        content: "Câu chuyện và giá trị của Thịnh Phát — kẹp tóc và phụ kiện tóc chọn lọc.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pb-24">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:pt-16">
        <div>
          <p className="eyebrow">Giới thiệu</p>
          <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Kẹp tóc chọn lọc, cách đặt hàng thật đơn giản
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Thịnh Phát bắt đầu từ mong muốn giúp các bạn dễ dàng tìm được chiếc kẹp tóc phù hợp với
            mình. Thay vì phải lướt qua hàng nghìn sản phẩm, chúng tôi chọn lọc những mẫu đẹp, bền và
            dễ phối để bạn chỉ cần chọn và nhắn tin.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Website này là nơi trưng bày sản phẩm. Mọi trao đổi về màu sắc, số lượng và giao hàng đều
            diễn ra trực tiếp qua Zalo, nhanh gọn và thân thiện.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border/70 shadow-lift">
          <img
            src={aboutImage}
            alt="Không gian làm việc và trưng bày kẹp tóc của Thịnh Phát"
            width={1200}
            height={1200}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHeader eyebrow="Giá trị" title="Điều Thịnh Phát luôn giữ" />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-rose">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-20">
        <CTASection />
      </div>
    </div>
  );
}
