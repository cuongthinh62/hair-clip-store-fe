import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import type { BackendProduct, GetProductsParams, ProductFormValues } from "@/types";

const PAGE_SIZE = 20; // Tăng kích thước trang mặc định lên 20 để tránh bị cắt bớt sản phẩm

export function useProducts() {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [params, setParams] = useState<GetProductsParams>({
    page: 1,
    limit: PAGE_SIZE,
    search: "",
    sort: "-updatedAt",
  });
  const requestId = useRef(0);

  const fetchProducts = useCallback(async (query: GetProductsParams) => {
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      // Gửi cả pageSize và limit để đảm bảo Express Backend nhận đúng tham số phân trang
      const apiQuery = {
        ...query,
        pageSize: query.limit || PAGE_SIZE,
      };

      const res = await api.getProducts(apiQuery as GetProductsParams);
      if (currentRequestId !== requestId.current) return;

      setProducts(res.data);
      // Fallback lấy tổng số sản phẩm từ res.meta.total hoặc độ dài mảng dữ liệu trả về
      setTotal(res.meta?.total ?? res.data.length);
    } catch (err) {
      if (currentRequestId !== requestId.current) return;
      setError(err instanceof Error ? err.message : "Không tải được sản phẩm");
    } finally {
      if (currentRequestId === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(params);
  }, [params, fetchProducts]);

  const setSearch = (search: string) => setParams((p) => ({ ...p, search, page: 1 }));
  const setCategoryFilter = (categoryId: string | undefined) =>
    setParams((p) => ({ ...p, categoryId, page: 1 }));
  const setStatusFilter = (status: GetProductsParams["status"]) =>
    setParams((p) => {
      const next = { ...p, page: 1 };
      if (status === undefined) {
        delete next.status;
      } else {
        next.status = status;
      }
      return next;
    });
  const setSort = (sort: string) => setParams((p) => ({ ...p, sort, page: 1 }));
  const setPage = (page: number) => setParams((p) => ({ ...p, page }));

  const createProduct = async (values: ProductFormValues) => {
    setSaving(true);
    try {
      const res = await api.createProduct(values);
      await fetchProducts(params);
      return res.data;
    } finally {
      setSaving(false);
    }
  };

  const updateProduct = async (id: string, values: Partial<ProductFormValues>) => {
    setSaving(true);
    try {
      const res = await api.updateProduct(id, values);
      setProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
      return res.data;
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
    setTotal((t) => Math.max(0, t - 1));
  };

  return {
    products,
    total,
    loading,
    error,
    saving,
    params,
    pageSize: PAGE_SIZE,
    setSearch,
    setCategoryFilter,
    setStatusFilter,
    setSort,
    setPage,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: () => fetchProducts(params),
  };
}
