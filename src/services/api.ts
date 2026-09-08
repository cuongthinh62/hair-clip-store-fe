import type {
  ApiResponse,
  BackendCategory,
  BackendProduct,
  GetProductsParams,
  LoginCredentials,
  LoginResponseData,
} from "@/types";

// Token storage key
const ACCESS_TOKEN_KEY = "accessToken";

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = (token: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch (e) {
    console.error("Không thể lưu token vào localStorage:", e);
  }
};

export const removeStoredToken = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (e) {
    console.error("Không thể xóa token khỏi localStorage:", e);
  }
};

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
  const token = getStoredToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
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
  // ================== AUTH API ==================

  /**
   * Đăng nhập quản trị viên
   * Payload: { username, password, secretKey }
   * Lưu accessToken vào localStorage nếu thành công
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponseData>> {
    const response = await request<LoginResponseData>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Trích xuất token từ nhiều cấu trúc response có thể có từ BE
    const rawData = response.data as unknown;
    let extractedToken: string | undefined;

    if (typeof rawData === "string") {
      extractedToken = rawData;
    } else if (rawData && typeof rawData === "object") {
      const dataObj = rawData as Record<string, unknown>;
      if (typeof dataObj["accessToken"] === "string") {
        extractedToken = dataObj["accessToken"];
      } else if (typeof dataObj["token"] === "string") {
        extractedToken = dataObj["token"];
      }
    }

    if (extractedToken) {
      setStoredToken(extractedToken);
    }

    return response;
  },

  /**
   * Đăng xuất quản trị viên: Xoá token và gọi BE (nếu có endpoint)
   */
  async logout(): Promise<void> {
    try {
      await request<unknown>("/auth/logout", {
        method: "POST",
      });
    } catch {
      // Bỏ qua lỗi mạng khi logout để luôn dọn dẹp local storage
    } finally {
      removeStoredToken();
    }
  },

  /**
   * Kiểm tra trạng thái đã đăng nhập hay chưa
   */
  isAuthenticated(): boolean {
    return Boolean(getStoredToken());
  },

  /**
   * Lấy token hiện tại
   */
  getToken(): string | null {
    return getStoredToken();
  },

  // ================== PRODUCT API ==================

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
   * Tạo sản phẩm mới (Admin)
   */
  async createProduct(data: Partial<BackendProduct>): Promise<ApiResponse<BackendProduct>> {
    return request<BackendProduct>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Cập nhật sản phẩm (Admin)
   */
  async updateProduct(
    id: string,
    data: Partial<BackendProduct>,
  ): Promise<ApiResponse<BackendProduct>> {
    return request<BackendProduct>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Xoá sản phẩm (Admin)
   */
  async deleteProduct(id: string): Promise<ApiResponse<unknown>> {
    return request<unknown>(`/products/${id}`, {
      method: "DELETE",
    });
  },

  // ================== CATEGORY API ==================

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

  /**
   * Tạo danh mục mới (Admin)
   */
  async createCategory(data: Partial<BackendCategory>): Promise<ApiResponse<BackendCategory>> {
    return request<BackendCategory>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Cập nhật danh mục (Admin)
   */
  async updateCategory(
    id: string,
    data: Partial<BackendCategory>,
  ): Promise<ApiResponse<BackendCategory>> {
    return request<BackendCategory>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Xoá danh mục (Admin)
   */
  async deleteCategory(id: string): Promise<ApiResponse<unknown>> {
    return request<unknown>(`/categories/${id}`, {
      method: "DELETE",
    });
  },
};
