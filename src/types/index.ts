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

export interface BackendCategory {
  _id: string;
  categoryName: string;
  slug: string;
  description?: string | undefined;
  imgUrl?: string | undefined;
  isActive: boolean;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

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
