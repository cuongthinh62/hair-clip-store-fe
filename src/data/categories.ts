import type { Category } from "@/types";

import catCangCua from "@/assets/cat-cangcua.jpg";
import catNo from "@/assets/cat-no.jpg";
import catBam from "@/assets/cat-bam.jpg";
import catToiGian from "@/assets/cat-toigian.jpg";
import catDeThuong from "@/assets/cat-dethuong.jpg";
import catKhac from "@/assets/cat-khac.jpg";

export const categories: Category[] = [
  {
    id: "1",
    name: "Kẹp càng cua",
    slug: "kep-cang-cua",
    image: catCangCua,
    description: "Kẹp giữ tóc chắc chắn, nhiều kích cỡ và màu sắc trung tính.",
  },
  {
    id: "2",
    name: "Kẹp nơ",
    slug: "kep-no",
    image: catNo,
    description: "Mẫu nơ satin, nhung và ngọc trai nhẹ nhàng, nữ tính.",
  },
  {
    id: "3",
    name: "Kẹp bấm",
    slug: "kep-bam",
    image: catBam,
    description: "Kẹp bấm nhỏ gọn, dễ phối cho tóc mái và tóc ngắn.",
  },
  {
    id: "4",
    name: "Kẹp tóc tối giản",
    slug: "toi-gian",
    image: catToiGian,
    description: "Thiết kế trơn, đơn sắc, phù hợp đi làm và đi học.",
  },
  {
    id: "5",
    name: "Kẹp tóc dễ thương",
    slug: "de-thuong",
    image: catDeThuong,
    description: "Mẫu hoa, pastel và họa tiết đáng yêu cho các bạn nữ.",
  },
  {
    id: "6",
    name: "Phụ kiện tóc khác",
    slug: "phu-kien-khac",
    image: catKhac,
    description: "Cột tóc, băng đô và kẹp ghim để hoàn thiện phong cách.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}
