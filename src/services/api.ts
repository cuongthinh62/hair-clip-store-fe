import type { ApiResponse, BackendCategory, BackendProduct, GetProductsParams } from "@/types";

// API Base URL: Lấy từ biến môi trường hoặc fallback về localhost:5000/api/v1
const getApiBaseUrl = (): string => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env["VITE_API_URL"]) {
    return import.meta.env["VITE_API_URL"].replace(/\/+$/, "");
  }
  return "http://localhost:5000/api/v1";
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Helper gọi HTTP Request chuẩn hóa
 */
async function request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { message: errorText || res.statusText };
      }
      throw new Error(errorJson.message || `HTTP error! status: ${res.status}`);
    }

    const json: ApiResponse<T> = await res.json();
    return json;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Xây dựng query string từ object params
 */
function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  /**
   * Lấy danh sách sản phẩm (có filter, pagination, search, categorySlug...)
   */
  async getProducts(params?: GetProductsParams): Promise<ApiResponse<BackendProduct[]>> {
    const qs = buildQueryString(params as Record<string, unknown>);
    return request<BackendProduct[]>(`/products${qs}`);
  },

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  async getProductById(id: string): Promise<ApiResponse<BackendProduct>> {
    return request<BackendProduct>(`/products/${id}`);
  },

  /**
   * Lấy chi tiết sản phẩm theo Slug
   */
  async getProductBySlug(slug: string): Promise<ApiResponse<BackendProduct>> {
    return request<BackendProduct>(`/products/slug/${encodeURIComponent(slug)}`);
  },

  /**
   * Lấy danh sách toàn bộ danh mục
   */
  async getCategories(): Promise<ApiResponse<BackendCategory[]>> {
    return request<BackendCategory[]>("/categories");
  },

  /**
   * Lấy danh sách sản phẩm thuộc 1 danh mục theo ID
   */
  async getProductsByCategory(
    categoryId: string,
    params?: Omit<GetProductsParams, "categoryId">,
  ): Promise<ApiResponse<BackendProduct[]>> {
    const qs = buildQueryString(params as Record<string, unknown>);
    return request<BackendProduct[]>(`/categories/${categoryId}/products${qs}`);
  },
};
