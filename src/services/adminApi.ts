const API_BASE_URL = "http://localhost:5000/api/v1";

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface Category {
  _id: string;
  categoryName: string;
  slug: string;
  description?: string;
  imgUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;

  categoryId:
    | string
    | {
        _id: string;
        categoryName: string;
        slug: string;
      };

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

  soldQuantity: number;
  bestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const possibleKeys = ["token", "accessToken", "access_token", "jwt", "authToken"];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  return null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let result: any = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.message || `Request failed with status ${response.status}`);
  }

  return result;
}

/* =========================
   CATEGORY API
========================= */

export async function getCategories(): Promise<Category[]> {
  const response = await request<ApiResponse<Category[]>>("/categories");

  return response.data || [];
}

export async function getCategoryById(id: string): Promise<Category> {
  const response = await request<ApiResponse<Category>>(`/categories/${id}`);

  return response.data;
}

export async function getProductsByCategory(id: string): Promise<Product[]> {
  const response = await request<ApiResponse<Product[]>>(`/categories/${id}/products`);

  return response.data || [];
}

export async function createCategory(data: Partial<Category>): Promise<Category> {
  const response = await request<ApiResponse<Category>>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.data;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  const response = await request<ApiResponse<Category>>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await request(`/categories/${id}`, {
    method: "DELETE",
  });
}

/* =========================
   PRODUCT API
========================= */

export async function getProducts(): Promise<Product[]> {
  const response = await request<ApiResponse<Product[]>>("/products");

  return response.data || [];
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await request<ApiResponse<Product>>(`/products/slug/${slug}`);

  return response.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await request<ApiResponse<Product>>(`/products/${id}`);

  return response.data;
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const response = await request<ApiResponse<Product>>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.data;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const response = await request<ApiResponse<Product>>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await request(`/products/${id}`, {
    method: "DELETE",
  });
}
