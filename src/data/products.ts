import type { Product } from "@/types";

import imgCangCua from "@/assets/cat-cangcua.jpg";
import imgNo from "@/assets/cat-no.jpg";
import imgBam from "@/assets/cat-bam.jpg";
import imgToiGian from "@/assets/cat-toigian.jpg";
import imgDeThuong from "@/assets/cat-dethuong.jpg";
import imgKhac from "@/assets/cat-khac.jpg";
import imgPearl from "@/assets/prod-pearl.jpg";
import imgMarble from "@/assets/prod-marble.jpg";
import imgHero from "@/assets/hero.jpg";

export const products: Product[] = [
  {
    id: "1",
    name: "Kẹp Càng Cua Trơn Basic",
    slug: "kep-cang-cua-tron-basic",
    category: "kep-cang-cua",
    productCode: "KC-001",
    price: 35000,
    description:
      "Mẫu kẹp càng cua trơn cơ bản với dáng bản vừa, giữ tóc chắc và dễ phối với mọi trang phục hằng ngày.",
    material: "Nhựa cao cấp",
    size: "8cm",
    colors: ["Đen", "Nâu", "Kem"],
    images: [imgCangCua, imgToiGian, imgHero],
    featured: true,
  },
  {
    id: "2",
    name: "Kẹp Tóc Nơ Ngọc Trai",
    slug: "kep-toc-no-ngoc-trai",
    category: "kep-no",
    productCode: "KN-001",
    price: 55000,
    description:
      "Kẹp nơ satin điểm ngọc trai nhân tạo, mang cảm giác nhẹ nhàng và sang trọng cho những dịp đặc biệt.",
    material: "Satin & ngọc trai nhân tạo",
    size: "9cm",
    colors: ["Trắng kem", "Hồng phấn"],
    images: [imgPearl, imgNo, imgHero],
    featured: true,
  },
  {
    id: "3",
    name: "Kẹp Bấm Tối Giản",
    slug: "kep-bam-toi-gian",
    category: "kep-bam",
    productCode: "KB-001",
    price: 25000,
    description:
      "Bộ kẹp bấm kim loại mảnh, nhỏ gọn, thích hợp giữ tóc mái hoặc tạo điểm nhấn tinh tế.",
    material: "Hợp kim mạ vàng",
    size: "5cm",
    colors: ["Vàng", "Bạc"],
    images: [imgBam, imgToiGian],
    featured: true,
  },
  {
    id: "4",
    name: "Kẹp Tóc Hoa Pastel",
    slug: "kep-toc-hoa-pastel",
    category: "de-thuong",
    productCode: "KT-001",
    price: 30000,
    description:
      "Kẹp tóc hình hoa cúc pastel dễ thương, phù hợp cho các bạn nữ yêu thích phong cách trẻ trung.",
    material: "Nhựa mềm",
    size: "4cm",
    colors: ["Hồng", "Trắng", "Tím nhạt"],
    images: [imgDeThuong, imgKhac],
    featured: true,
  },
  {
    id: "5",
    name: "Kẹp Càng Cua Vân Đá",
    slug: "kep-cang-cua-van-da",
    category: "kep-cang-cua",
    productCode: "KC-002",
    price: 45000,
    description:
      "Kẹp càng cua trong với hiệu ứng vân đá cẩm thạch, tạo vẻ ngoài hiện đại và nổi bật.",
    material: "Acrylic trong",
    size: "10cm",
    colors: ["Hồng vân", "Be vân"],
    images: [imgMarble, imgCangCua],
    featured: true,
  },
  {
    id: "6",
    name: "Kẹp Tóc Nơ Nhung",
    slug: "kep-toc-no-nhung",
    category: "kep-no",
    productCode: "KN-002",
    price: 49000,
    description:
      "Nơ nhung mềm mại, giữ dáng tốt, mang phong cách vintage nhẹ nhàng cho mùa mát.",
    material: "Nhung cao cấp",
    size: "10cm",
    colors: ["Nâu đất", "Đỏ mận", "Kem"],
    images: [imgNo, imgPearl],
    featured: true,
  },
  {
    id: "7",
    name: "Kẹp Tóc Hoa Trong Suốt",
    slug: "kep-toc-hoa-trong-suot",
    category: "de-thuong",
    productCode: "KT-002",
    price: 32000,
    description:
      "Kẹp tóc hoa trong suốt nhẹ nhàng, tạo cảm giác thanh mảnh và dễ phối màu.",
    material: "Acrylic trong",
    size: "5cm",
    colors: ["Trong suốt", "Hồng nhạt"],
    images: [imgDeThuong, imgMarble],
    featured: true,
  },
  {
    id: "8",
    name: "Kẹp Càng Cua Phong Cách Hàn Quốc",
    slug: "kep-cang-cua-phong-cach-han-quoc",
    category: "kep-cang-cua",
    productCode: "KC-003",
    price: 52000,
    description:
      "Dáng kẹp bản lớn theo phong cách Hàn Quốc, giữ được nhiều tóc và tạo kiểu búi tự nhiên.",
    material: "Nhựa cao cấp",
    size: "11cm",
    colors: ["Nâu đồi mồi", "Kem", "Đen"],
    images: [imgCangCua, imgHero, imgToiGian],
    featured: true,
  },
  {
    id: "9",
    name: "Kẹp Tóc Bản Vuông Tối Giản",
    slug: "kep-toc-ban-vuong-toi-gian",
    category: "toi-gian",
    productCode: "KT-003",
    price: 28000,
    description:
      "Kẹp bản vuông đơn sắc, thiết kế gọn gàng phù hợp môi trường công sở.",
    material: "Nhựa mờ",
    size: "7cm",
    colors: ["Đen", "Kem"],
    images: [imgToiGian, imgBam],
  },
  {
    id: "10",
    name: "Kẹp Bấm Ngọc Trai Nhỏ",
    slug: "kep-bam-ngoc-trai-nho",
    category: "kep-bam",
    productCode: "KB-002",
    price: 27000,
    description:
      "Set kẹp bấm đính hạt ngọc trai nhỏ, tạo điểm nhấn dịu dàng cho mái tóc.",
    material: "Hợp kim & ngọc trai nhân tạo",
    size: "5.5cm",
    colors: ["Vàng"],
    images: [imgBam, imgPearl],
  },
  {
    id: "11",
    name: "Kẹp Nơ Lụa Bản To",
    slug: "kep-no-lua-ban-to",
    category: "kep-no",
    productCode: "KN-003",
    price: 59000,
    description:
      "Nơ lụa bản to nhẹ nhàng, thích hợp chụp ảnh và các dịp dạo phố cuối tuần.",
    material: "Lụa satin",
    size: "12cm",
    colors: ["Hồng đất", "Kem", "Xanh khói"],
    images: [imgNo, imgHero],
  },
  {
    id: "12",
    name: "Kẹp Càng Cua Mini",
    slug: "kep-cang-cua-mini",
    category: "kep-cang-cua",
    productCode: "KC-004",
    price: 22000,
    description:
      "Kẹp càng cua mini dùng để kẹp tóc con hoặc tạo kiểu nửa buộc xinh xắn.",
    material: "Nhựa cao cấp",
    size: "4cm",
    colors: ["Nâu", "Kem", "Hồng"],
    images: [imgCangCua, imgDeThuong],
  },
  {
    id: "13",
    name: "Kẹp Tóc Vân Đá Bản Nhỏ",
    slug: "kep-toc-van-da-ban-nho",
    category: "toi-gian",
    productCode: "KT-004",
    price: 34000,
    description:
      "Mẫu kẹp vân đá bản nhỏ, tinh tế và dễ mang theo trong túi hằng ngày.",
    material: "Acrylic",
    size: "6cm",
    colors: ["Be vân", "Hồng vân"],
    images: [imgMarble, imgToiGian],
  },
  {
    id: "14",
    name: "Set Cột Tóc Vải Mềm",
    slug: "set-cot-toc-vai-mem",
    category: "phu-kien-khac",
    productCode: "PK-001",
    price: 39000,
    description:
      "Set cột tóc vải mềm không gây gãy tóc, màu sắc trung tính dễ phối.",
    material: "Vải cotton pha",
    size: "Đường kính 10cm",
    colors: ["Kem", "Hồng đất"],
    images: [imgKhac, imgNo],
  },
  {
    id: "15",
    name: "Băng Đô Vải Trơn",
    slug: "bang-do-vai-tron",
    category: "phu-kien-khac",
    productCode: "PK-002",
    price: 42000,
    description:
      "Băng đô vải trơn êm đầu, hỗ trợ giữ tóc gọn khi rửa mặt hoặc ở nhà.",
    material: "Vải cotton",
    size: "Free size",
    colors: ["Kem", "Nâu nhạt"],
    images: [imgKhac, imgHero],
  },
  {
    id: "16",
    name: "Kẹp Tóc Hoa Nhỏ Dễ Thương",
    slug: "kep-toc-hoa-nho-de-thuong",
    category: "de-thuong",
    productCode: "KT-005",
    price: 26000,
    description:
      "Set kẹp hoa nhỏ nhiều màu, tạo điểm nhấn tươi tắn cho mái tóc.",
    material: "Nhựa mềm",
    size: "3cm",
    colors: ["Hồng", "Trắng", "Vàng nhạt"],
    images: [imgDeThuong, imgKhac],
  },
  {
    id: "17",
    name: "Kẹp Bấm Bản Dài",
    slug: "kep-bam-ban-dai",
    category: "kep-bam",
    productCode: "KB-003",
    price: 29000,
    description:
      "Kẹp bấm bản dài giữ tóc mái chắc chắn, kiểu dáng thanh gọn.",
    material: "Hợp kim",
    size: "7cm",
    colors: ["Vàng", "Đen"],
    images: [imgBam, imgToiGian],
  },
  {
    id: "18",
    name: "Kẹp Tóc Ngọc Trai Tối Giản",
    slug: "kep-toc-ngoc-trai-toi-gian",
    category: "toi-gian",
    productCode: "KT-006",
    price: 45000,
    description:
      "Kẹp tóc phối ngọc trai nhỏ theo phong cách tối giản, nhẹ nhàng và sang trọng.",
    material: "Hợp kim & ngọc trai nhân tạo",
    size: "6.5cm",
    colors: ["Kem", "Trắng"],
    images: [imgPearl, imgBam],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.id !== product.id,
  );
  const others = products.filter(
    (p) => p.category !== product.category && p.id !== product.id,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}
