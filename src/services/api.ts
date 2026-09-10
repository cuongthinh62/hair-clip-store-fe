import type {
  ApiResponse,
  BackendCategory,
  BackendProduct,
  GetProductsParams,
  LoginCredentials,
  LoginResponseData,
} from "@/types";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

const storage = {
  get(key: string) {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
  remove(key: string) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};

export const getStoredToken = () => storage.get(ACCESS_TOKEN_KEY);
export const setStoredToken = (token: string) => storage.set(ACCESS_TOKEN_KEY, token);
export const removeStoredToken = () => storage.remove(ACCESS_TOKEN_KEY);

export const setStoredUser = (user: LoginResponseData["user"]) => {
  if (user) storage.set(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = <T = LoginResponseData["user"]>(): T | null => {
  const raw = storage.get(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const removeStoredUser = () => storage.remove(USER_KEY);

const API_BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.["VITE_API_URL"]
    ? import.meta.env["VITE_API_URL"].replace(/\/+$/, "")
    : "http://localhost:5000/api/v1";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const headers = new Headers(options?.headers);
  headers.set("Accept", "application/json");
  if (options?.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const token = getStoredToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });
  const text = await response.text();
  let body: { message?: string; error?: string } | T | undefined;
  if (text) {
    try {
      body = JSON.parse(text) as T;
    } catch {
      body = { message: text };
    }
  }
  if (!response.ok) {
    const errorBody = body as { message?: string; error?: string } | undefined;
    throw new Error(
      errorBody?.message || errorBody?.error || `Yêu cầu thất bại (${response.status})`,
    );
  }
  return body as T;
}

function buildQueryString(params?: Record<string, unknown>) {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const api = {
  async login(credentials: LoginCredentials) {
    const data = await request<LoginResponseData>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const token = data.accessToken ?? data.token;
    if (token) setStoredToken(token);
    if (data.user) setStoredUser(data.user);
    return data;
  },
  async logout() {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      removeStoredToken();
      removeStoredUser();
    }
  },
  isAuthenticated: () => Boolean(getStoredToken()),
  getToken: getStoredToken,
  getCurrentUser: () => getStoredUser<LoginResponseData["user"]>(),
  async getProducts(params?: GetProductsParams) {
    return request<ApiResponse<BackendProduct[]>>(`/products${buildQueryString(params)}`);
  },
  async getProductById(id: string) {
    return request<ApiResponse<BackendProduct>>(`/products/${encodeURIComponent(id)}`);
  },
  async getProductBySlug(slug: string) {
    return request<ApiResponse<BackendProduct>>(`/products/slug/${encodeURIComponent(slug)}`);
  },
  async createProduct(data: Partial<BackendProduct>) {
    return request<ApiResponse<BackendProduct>>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateProduct(id: string, data: Partial<BackendProduct>) {
    return request<ApiResponse<BackendProduct>>(`/products/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteProduct(id: string) {
    return request<ApiResponse<unknown>>(`/products/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  async getCategories() {
    return request<ApiResponse<BackendCategory[]>>("/categories");
  },
  async getProductsByCategory(categoryId: string, params?: Omit<GetProductsParams, "categoryId">) {
    return request<ApiResponse<BackendProduct[]>>(
      `/categories/${encodeURIComponent(categoryId)}/products${buildQueryString(params)}`,
    );
  },
  async createCategory(data: Partial<BackendCategory>) {
    return request<ApiResponse<BackendCategory>>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateCategory(id: string, data: Partial<BackendCategory>) {
    return request<ApiResponse<BackendCategory>>(`/categories/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteCategory(id: string) {
    return request<ApiResponse<unknown>>(`/categories/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
