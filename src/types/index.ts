/**
 * Entity & Domain Types for Hair Clip Store
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string; // Category slug reference
  categoryName?: string | undefined; // Tên danh mục hiển thị
  productCode: string;
  price?: number | undefined;
  discountPrice?: number | undefined;
  wholesalePrice?: number | undefined;
  description: string;
  material: string;
  size: string;
  colors: string[];
  images: string[];
  featured?: boolean | undefined;
  bestSeller?: boolean | undefined;
  stockQuantity?: number | undefined;
  soldQuantity?: number | undefined;
  occasion?: string | undefined;
  tags?: string[] | undefined;
  categoryId?: string | undefined;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount?: number | undefined;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface ZaloProductContext {
  name: string;
  productCode: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  phone: string;
  facebookUrl: string;
  zaloPhone: string;
}

// ================== BACKEND DTO TYPES ==================

export interface BackendProduct {
  _id: string;
  categoryId: string | BackendCategory;
  productName: string;
  slug: string;
  material?: string | undefined;
  description?: string | undefined;
  wholesalePrice?: number | undefined;
  price?: number | undefined;
  discountPrice?: number | undefined;
  stockQuantity?: number | undefined;
  color?: string | undefined;
  occasion?: string | undefined;
  imageUrl?: string | undefined;
  soldQuantity?: number | undefined;
  bestSeller?: boolean | undefined;
  isFeatured?: boolean | undefined;
  isActive?: boolean | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  meta: any;
  statusCode: number;
  message: string;
  data: T;
  pagination?: PaginationInfo | undefined;
}

export interface GetProductsParams {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  categoryId?: string | undefined;
  categorySlug?: string | undefined;
  color?: string | undefined;
  isFeatured?: boolean | undefined;
  bestSeller?: boolean | undefined;
  sortBy?: ("createdAt" | "price" | "soldQuantity") | undefined;
  sortOrder?: ("asc" | "desc") | undefined;
}

// ================== AUTH TYPES ==================

export interface LoginCredentials {
  username: string;
  password: string;
  secretKey: string;
}

export interface LoginResponseData {
  message?: string | undefined; // 👈 thêm dòng này
  accessToken?: string | undefined;
  token?: string | undefined;
  user?:
    | {
        _id?: string | undefined;
        username?: string | undefined;
        role?: string | undefined;
        [key: string]: unknown;
      }
    | undefined;
  [key: string]: unknown;
}

export type CreateCategoryPayload = Pick<BackendCategory, "categoryName" | "slug"> &
  Partial<Pick<BackendCategory, "description" | "imgUrl" | "isActive">>;

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type CreateProductPayload = Omit<
  Product,
  "_id" | "createdAt" | "updatedAt" | "soldQuantity" | "categoryId"
> & { categoryId: string };

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ================== CATEGORY ==================
export interface BackendCategory {
  _id: string;
  categoryName: string;
  slug: string;
  description?: string;
  imgUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CategoryFormValues = {
  categoryName: string;
  slug: string;
  description?: string;
  imgUrl?: string;
  isActive: boolean;
};

export type ProductFormValues = {
  categoryId: string;
  productName: string;
  slug: string;
  material?: string;
  description?: string;
  wholesalePrice: number;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  color?: string;
  occasion?: string;
  imageUrl?: string;
  bestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
};

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: "active" | "inactive";
  sort?: string;
}
