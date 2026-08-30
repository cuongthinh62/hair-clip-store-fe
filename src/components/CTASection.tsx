import { ZaloButton } from "./ZaloButton";

export function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="reveal rounded-3xl border border-border/70 bg-beige px-6 py-14 text-center sm:px-12 sm:py-20">
        <p className="eyebrow">Đặt hàng dễ dàng</p>
        <h2 className="mx-auto mt-3 max-w-xl text-3xl font-semibold text-foreground sm:text-4xl">
          Bạn đã tìm được mẫu mình yêu thích?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Nhắn tin trực tiếp cho Thịnh Phát qua Zalo để được tư vấn thêm thông tin và chốt số lượng
          sản phẩm.
        </p>
        <ZaloButton size="lg" label="Chat với Thịnh Phát trên Zalo" className="mt-8" />
      </div>
    </section>
  );
}
