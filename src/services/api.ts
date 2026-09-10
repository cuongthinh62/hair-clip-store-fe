import type {
  ApiResponse,
  BackendCategory,
  BackendProduct,
  GetProductsParams,
  LoginCredentials,
  LoginResponseData,
} from "@/types";

// ================== STORAGE KEYS ==================
const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

// ================== TOKEN STORAGE ==================

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

// ================== USER STORAGE ==================
export const setStoredUser = (user: LoginResponseData["user"]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Không thể lưu user vào localStorage:", e);
  }
};

export const getStoredUser = <T = LoginResponseData["user"]>(): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const removeStoredUser = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error("Không thể xóa user khỏi localStorage:", e);
  }
};

// ================== API BASE URL ==================
const getApiBaseUrl = (): string => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env["VITE_API_URL"]) {
    return import.meta.env["VITE_API_URL"].replace(/\/+$/, "");
  }
  return "http://localhost:5000/api/v1";
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Helper gọi HTTP Request chuẩn hóa.
 * Trả về JSON thô đã parse (không ép kiểu ApiResponse ở đây,
 * vì một số endpoint như /auth/login trả object phẳng, không bọc "data").
 */
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
      let errorJson: { message?: string };
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { message: errorText || res.statusText };
      }
      throw new Error(errorJson.message || `HTTP error! status: ${res.status}`);
    }

    // FIX: parse an toàn cho response rỗng (vd: 204 No Content ở DELETE),
    // tránh res.json() throw "Unexpected end of JSON input" dù request đã thành công.
    const rawText = await res.text();
    if (!rawText) {
      return undefined as T;
    }
    try {
      return JSON.parse(rawText) as T;
    } catch (parseErr) {
      console.error(`[API Parse Error] ${endpoint}:`, parseErr);
      throw new Error("Không đọc được dữ liệu trả về từ server");
    }
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
   * BE trả về object PHẲNG: { message, accessToken, user }
   */
  async login(credentials: LoginCredentials): Promise<LoginResponseData> {
    const data = await request<LoginResponseData>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // FIX: fallback an toàn về mặt kiểu (không còn đọc data.token nếu field
    // đó không tồn tại trên LoginResponseData) + báo lỗi rõ ràng nếu thiếu token,
    // thay vì âm thầm "đăng nhập thành công" mà không lưu được gì.
    const token = data.accessToken ?? (data as unknown as { token?: string }).token;

    if (!token) {
      throw new Error("Đăng nhập thất bại: server không trả về accessToken");
    }

    setStoredToken(token);
    if (data.user) setStoredUser(data.user);

    return data;
  },

  /**
   * Đăng xuất quản trị viên: Xoá token/user local và gọi BE (nếu có endpoint)
   */
  async logout(): Promise<void> {
    try {
      await request<unknown>("/auth/logout", { method: "POST" });
    } catch {
      // Bỏ qua lỗi mạng khi logout để luôn dọn dẹp local storage
    } finally {
      removeStoredToken();
      removeStoredUser();
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

  /**
   * Lấy thông tin user đã đăng nhập (từ localStorage)
   */
  getCurrentUser(): LoginResponseData["user"] | null {
    return getStoredUser<LoginResponseData["user"]>();
  },

  // ================== PRODUCT API ==================

  async getProducts(params?: GetProductsParams): Promise<ApiResponse<BackendProduct[]>> {
    const qs = buildQueryString(params as Record<string, unknown>);
    return request<ApiResponse<BackendProduct[]>>(`/products${qs}`);
  },

  async getProductById(id: string): Promise<ApiResponse<BackendProduct>> {
    return request<ApiResponse<BackendProduct>>(`/products/${id}`);
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<BackendProduct>> {
    return request<ApiResponse<BackendProduct>>(`/products/slug/${encodeURIComponent(slug)}`);
  },

  async createProduct(data: Partial<BackendProduct>): Promise<ApiResponse<BackendProduct>> {
    return request<ApiResponse<BackendProduct>>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateProduct(
    id: string,
    data: Partial<BackendProduct>,
  ): Promise<ApiResponse<BackendProduct>> {
    return request<ApiResponse<BackendProduct>>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string): Promise<ApiResponse<unknown>> {
    return request<ApiResponse<unknown>>(`/products/${id}`, {
      method: "DELETE",
    });
  },

  // ================== CATEGORY API ==================

  async getCategories(): Promise<ApiResponse<BackendCategory[]>> {
    return request<ApiResponse<BackendCategory[]>>("/categories");
  },

  async getProductsByCategory(
    categoryId: string,
    params?: Omit<GetProductsParams, "categoryId">,
  ): Promise<ApiResponse<BackendProduct[]>> {
    const qs = buildQueryString(params as Record<string, unknown>);
    return request<ApiResponse<BackendProduct[]>>(`/categories/${categoryId}/products${qs}`);
  },

  async createCategory(data: Partial<BackendCategory>): Promise<ApiResponse<BackendCategory>> {
    return request<ApiResponse<BackendCategory>>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCategory(
    id: string,
    data: Partial<BackendCategory>,
  ): Promise<ApiResponse<BackendCategory>> {
    return request<ApiResponse<BackendCategory>>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string): Promise<ApiResponse<unknown>> {
    return request<ApiResponse<unknown>>(`/categories/${id}`, {
      method: "DELETE",
    });
  },
};
