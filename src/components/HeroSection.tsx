import { Link } from "@tanstack/react-router";

import heroImage from "@/assets/hero.jpg";
import { ZaloButton } from "./ZaloButton";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-8 pb-14 sm:gap-10 sm:px-6 sm:pt-10 sm:pb-16 lg:grid-cols-2 lg:gap-16 lg:pt-20 lg:pb-24">
      <div className="reveal">
        <p className="eyebrow">Kẹp tóc & phụ kiện</p>
        <h1 className="mt-3 text-3xl leading-[1.15] font-semibold text-foreground sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
          Khám phá những mẫu kẹp tóc dành cho bạn
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:max-w-xl sm:text-base">
          Thịnh Phát mang đến nhiều mẫu kẹp tóc đa dạng với nhiều kiểu dáng, màu sắc và phong cách
          khác nhau. Dễ dàng khám phá sản phẩm và liên hệ qua Zalo để đặt hàng.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            to="/san-pham"
            search={{ danh_muc: undefined }}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:h-13 sm:w-auto sm:text-base"
          >
            Khám phá sản phẩm
          </Link>
          <ZaloButton size="lg" variant="outline" className="w-full sm:w-auto" />
        </div>
      </div>

      <div className="reveal relative pb-0 sm:pb-6">
        <div className="overflow-hidden rounded-2xl border border-border/70 shadow-lift sm:rounded-3xl">
          <img
            src="https://res.cloudinary.com/qrmat5by/image/upload/v1787988041/9813a0fa-0e53-4399-9c0e-c17c6332ce64.jpg"
            alt="Bộ sưu tập kẹp tóc và phụ kiện của Thịnh Phát"
            width={1600}
            height={1200}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute -bottom-6 left-4 hidden rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-soft sm:block">
          <p className="text-2xl font-semibold text-foreground">18+</p>
          <p className="text-xs text-muted-foreground">mẫu kẹp tóc đang có sẵn</p>
        </div>
      </div>
    </section>
  );
}
