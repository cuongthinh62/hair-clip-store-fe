import catBam from "@/assets/cat-bam.jpg";
import catCangCua from "@/assets/cat-cangcua.jpg";
import catDeThuong from "@/assets/cat-dethuong.jpg";
import catKhac from "@/assets/cat-khac.jpg";
import catNo from "@/assets/cat-no.jpg";
import catToiGian from "@/assets/cat-toigian.jpg";
import defaultHero from "@/assets/hero.jpg";

import { categories as fallbackCategories } from "@/data/categories";
import { products as fallbackProducts } from "@/data/products";
import type {
  BackendCategory,
  BackendProduct,
  Category,
  GetProductsParams,
  Product,
} from "@/types";
import { api } from "./api";

/**
 * Bản đồ ảnh mặc định cho từng slug danh mục nếu Backend chưa có imgUrl
 */
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "kep-me": catCangCua,
  "kep-suon-sat-vai-canh-quat": catNo,
  "gap-toc-nam-rang": catBam,
  "gap-toc-nam-rang-beo-xoan": catDeThuong,
  "gap-chu-t-no-voan": catToiGian,
  "kep-dinh-da-pha-le-cao-cap": catKhac,
  "kep-cang-cua": catCangCua,
  "kep-no": catNo,
  "kep-bam": catBam,
  "toi-gian": catToiGian,
  "de-thuong": catDeThuong,
  "phu-kien-khac": catKhac,
};

export function getCategoryFallbackImage(slug: string): string {
  return CATEGORY_IMAGE_MAP[slug] || defaultHero;
}

/**
 * Chuẩn hóa Backend Category sang Frontend Category Domain Model
 */
export function mapBackendCategory(doc: BackendCategory): Category {
  return {
    id: doc._id,
    name: doc.categoryName,
    slug: doc.slug,
    image: doc.imgUrl && doc.imgUrl.trim() !== "" ? doc.imgUrl : getCategoryFallbackImage(doc.slug),
    description: doc.description || "",
  };
}

/**
 * Chuẩn hóa Backend Product sang Frontend Product Domain Model
 */
export function mapBackendProduct(doc: BackendProduct): Product {
  let categorySlug = "";
  let categoryName = "";
  let categoryId = "";

  if (typeof doc.categoryId === "object" && doc.categoryId !== null) {
    categorySlug = doc.categoryId.slug || "";
    categoryName = doc.categoryId.categoryName || "";
    categoryId = doc.categoryId._id || "";
  } else if (typeof doc.categoryId === "string") {
    categoryId = doc.categoryId;
    categorySlug = doc.categoryId;
  }

  // Tách màu sắc từ chuỗi sang mảng
  const colors = doc.color
    ? doc.color
        .split(/[,/|•]/)
        .map((c) => c.trim())
        .filter(Boolean)
    : ["Nhiều màu sắc"];

  // Tạo mã sản phẩm dễ nhớ nếu chưa có trường riêng
  const productCode = `TP-${doc._id.slice(-4).toUpperCase()}`;

  // Chuẩn bị danh sách ảnh
  const images = doc.imageUrl && doc.imageUrl.trim() !== "" ? [doc.imageUrl] : [defaultHero];

  return {
    id: doc._id,
    name: doc.productName,
    slug: doc.slug,
    category: categorySlug,
    categoryName: categoryName || undefined,
    categoryId,
    productCode,
    price: doc.price,
    discountPrice: doc.discountPrice,
    wholesalePrice: doc.wholesalePrice,
    description: doc.description || "",
    material: doc.material || "Chất liệu cao cấp & hợp kim",
    size: "Tiêu chuẩn",
    colors: colors.length > 0 ? colors : ["Nhiều màu sắc"],
    images,
    featured: Boolean(doc.isFeatured),
    bestSeller: Boolean(doc.bestSeller),
    stockQuantity: doc.stockQuantity ?? 0,
    soldQuantity: doc.soldQuantity ?? 0,
    occasion: doc.occasion || "",
  };
}

/**
 * Lớp dịch vụ lấy dữ liệu danh mục & sản phẩm từ Backend API
 * Có hỗ trợ fallback sang mock data nếu API gặp sự cố
 */
export const catalogService = {
  /**
   * Lấy danh sách toàn bộ danh mục từ API
   */
  async listCategories(): Promise<Category[]> {
    try {
      const response = await api.getCategories();
      if (response.data && response.data.length > 0) {
        return response.data.map(mapBackendCategory);
      }
      return fallbackCategories;
    } catch (error) {
      console.warn("Không thể tải danh mục từ API, sử dụng dữ liệu dự phòng:", error);
      return fallbackCategories;
    }
  },

  /**
   * Lấy chi tiết danh mục theo slug
   */
  async getCategory(slug: string): Promise<Category | undefined> {
    const cats = await this.listCategories();
    return cats.find((c) => c.slug === slug);
  },

  /**
   * Lấy danh sách sản phẩm với các bộ lọc (phân trang, tìm kiếm, danh mục, nổi bật...)
   * ⚠️ Backend CHỈ hiểu query param "categoryId" (ObjectId), KHÔNG hiểu "categorySlug".
   * Nên phải tự resolve categorySlug -> categoryId trước khi gọi API,
   * nếu không backend sẽ bỏ qua filter và trả về toàn bộ sản phẩm (bug đã gặp).
   */
  async listProducts(params?: GetProductsParams): Promise<Product[]> {
    try {
      let resolvedParams: GetProductsParams = { ...params };

      if (resolvedParams.categorySlug && !resolvedParams.categoryId) {
        const category = await this.getCategory(resolvedParams.categorySlug);
        if (category) {
          resolvedParams = { ...resolvedParams, categoryId: category.id };
        }
      }
      // Xoá categorySlug trước khi gửi lên API vì backend không nhận field này
      delete resolvedParams.categorySlug;

      const response = await api.getProducts(resolvedParams);
      if (response.data && response.data.length > 0) {
        return response.data.map(mapBackendProduct);
      }
      // Nếu lọc mà không có kết quả từ DB, trả về mảng rỗng
      if (resolvedParams?.categoryId || resolvedParams?.search) {
        return [];
      }
      return fallbackProducts;
    } catch (error) {
      console.warn("Không thể tải sản phẩm từ API, sử dụng dữ liệu dự phòng:", error);
      if (params?.categorySlug) {
        return fallbackProducts.filter((p) => p.category === params.categorySlug);
      }
      return fallbackProducts;
    }
  },

  /**
   * Lấy chi tiết 1 sản phẩm theo slug
   */
  async getProduct(slug: string): Promise<Product | undefined> {
    try {
      const response = await api.getProductBySlug(slug);
      if (response.data) {
        return mapBackendProduct(response.data);
      }
      return fallbackProducts.find((p) => p.slug === slug);
    } catch (error) {
      console.warn(`Không tìm thấy sản phẩm ${slug} từ API:`, error);
      return fallbackProducts.find((p) => p.slug === slug);
    }
  },

  /**
   * Lấy danh sách sản phẩm nổi bật
   */
  async getFeatured(limit = 8): Promise<Product[]> {
    try {
      const response = await api.getProducts({ isFeatured: true, limit });
      if (response.data && response.data.length > 0) {
        return response.data.map(mapBackendProduct).slice(0, limit);
      }
      return fallbackProducts.filter((p) => p.featured).slice(0, limit);
    } catch (error) {
      console.warn("Không thể tải sản phẩm nổi bật từ API, dùng dữ liệu dự phòng:", error);
      return fallbackProducts.filter((p) => p.featured).slice(0, limit);
    }
  },

  /**
   * Lấy danh sách sản phẩm theo Slug danh mục
   */
  async getByCategory(slug: string, limit?: number): Promise<Product[]> {
    return this.listProducts({ categorySlug: slug, ...(limit != null ? { limit } : {}) });
  },

  /**
   * Lấy danh sách sản phẩm gợi ý / liên quan
   */
  async getRelated(product: Product, limit = 4): Promise<Product[]> {
    try {
      let relatedDocs: Product[] = [];
      if (product.category) {
        const byCat = await this.listProducts({ categorySlug: product.category, limit: limit + 2 });
        relatedDocs = byCat.filter((p) => p.id !== product.id && p.slug !== product.slug);
      }

      if (relatedDocs.length < limit) {
        const otherProducts = await this.listProducts({ limit: limit + 4 });
        const additional = otherProducts.filter(
          (p) =>
            p.id !== product.id &&
            p.slug !== product.slug &&
            !relatedDocs.some((r) => r.id === p.id),
        );
        relatedDocs = [...relatedDocs, ...additional];
      }

      return relatedDocs.slice(0, limit);
    } catch {
      const sameCategory = fallbackProducts.filter(
        (p) => p.category === product.category && p.id !== product.id,
      );
      const others = fallbackProducts.filter(
        (p) => p.category !== product.category && p.id !== product.id,
      );
      return [...sameCategory, ...others].slice(0, limit);
    }
  },
};

/**
 * Bỏ dấu tiếng Việt để so sánh không phân biệt dấu.
 * VD: "Ghi Bạc" -> "ghi bac", giúp gõ "bac" vẫn tìm ra "Bạc".
 */
function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

/**
 * Tìm kiếm sản phẩm theo từ khóa (tên, mã sản phẩm, danh mục, mô tả).
 * Không phân biệt dấu tiếng Việt (gõ "bac" vẫn tìm ra "Bạc").
 */
export function searchProducts(
  list: Product[],
  query: string,
  categoryNameOf?: (slug: string) => string,
): Product[] {
  const q = removeVietnameseTones(query.trim());
  if (!q) return list;
  return list.filter((p) => {
    const catName = p.categoryName || (categoryNameOf ? categoryNameOf(p.category) : p.category);
    const haystack = removeVietnameseTones(
      [p.name, p.productCode, catName, p.description, p.material, p.occasion]
        .filter(Boolean)
        .join(" "),
    );
    return haystack.includes(q);
  });
}
