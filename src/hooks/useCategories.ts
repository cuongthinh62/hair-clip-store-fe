import { useCallback, useEffect, useState } from "react";
import { api } from "@/services/api";
import type { BackendCategory, CategoryFormValues } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCategories();
      setCategories(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được danh mục");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (values: CategoryFormValues) => {
    setSaving(true);
    try {
      const res = await api.createCategory(values);
      setCategories((prev) => [res.data, ...prev]);
      return res.data;
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = async (id: string, values: Partial<CategoryFormValues>) => {
    setSaving(true);
    try {
      const res = await api.updateCategory(id, values);
      setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)));
      return res.data;
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  return {
    categories,
    loading,
    error,
    saving,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
