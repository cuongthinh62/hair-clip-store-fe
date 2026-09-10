import { createFileRoute } from "@tanstack/react-router";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type Category,
} from "@/services/adminApi";

import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const [error, setError] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();

      setCategories(data);
    } catch (err: any) {
      setError(err?.message || "Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.categoryName?.toLowerCase().includes(keyword) ||
        category.slug?.toLowerCase().includes(keyword)
      );
    });
  }, [categories, search]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setModalOpen(true);
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa danh mục "${category.categoryName}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await deleteCategory(category._id);

      await loadCategories();
    } catch (err: any) {
      alert(err?.message || "Xóa danh mục thất bại");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data = {
      categoryName: String(formData.get("categoryName") || "").trim(),

      slug: String(formData.get("slug") || "").trim(),

      description: String(formData.get("description") || "").trim(),

      imgUrl: String(formData.get("imgUrl") || "").trim(),

      isActive: formData.get("isActive") === "on",
    };

    if (!data.categoryName) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setSaving(true);

      if (editing) {
        await updateCategory(editing._id, data);
      } else {
        await createCategory(data);
      }

      setModalOpen(false);
      setEditing(null);

      await loadCategories();
    } catch (err: any) {
      alert(err?.message || "Không thể lưu danh mục");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Danh mục</h1>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {categories.length} danh mục
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">Quản lý danh mục sản phẩm của cửa hàng.</p>
        </div>

        <button
          onClick={openCreate}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          + Thêm danh mục
        </button>
      </div>

      {/* SEARCH */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm danh mục..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">Danh mục</th>

                <th className="px-5 py-4">Slug</th>

                <th className="px-5 py-4">Mô tả</th>

                <th className="px-5 py-4">Trạng thái</th>

                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-slate-400">
                    Đang tải danh mục...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-slate-400">
                    Không có danh mục nào.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {category.imgUrl ? (
                          <img
                            src={category.imgUrl}
                            alt=""
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg">
                            📦
                          </div>
                        )}

                        <div>
                          <div className="font-semibold text-slate-800">
                            {category.categoryName}
                          </div>

                          <div className="mt-1 text-xs text-slate-400">ID: {category._id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">{category.slug}</td>

                    <td className="max-w-[280px] px-5 py-4 text-sm text-slate-500">
                      <div className="truncate">{category.description || "—"}</div>
                    </td>

                    <td className="px-5 py-4">
                      {category.isActive ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(category)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Sửa
                        </button>

                        <button
                          disabled={saving}
                          onClick={() => handleDelete(category)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editing ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">Nhập thông tin danh mục.</p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="text-xl text-slate-400 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <Field
                label="Tên danh mục"
                name="categoryName"
                defaultValue={editing?.categoryName ?? ""}
                required
              />

              <Field
                label="Slug"
                name="slug"
                defaultValue={editing?.slug ?? ""}
                placeholder="kep-toc-con-cua"
              />

              <Field
                label="URL hình ảnh"
                name="imgUrl"
                defaultValue={editing?.imgUrl ?? ""}
                placeholder="https://..."
              />

              <div>
                <label className="mb-2 block text-sm font-semibold">Mô tả</label>

                <textarea
                  name="description"
                  defaultValue={editing?.description || ""}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editing ? editing.isActive : true}
                  className="h-4 w-4"
                />

                <span className="font-medium">Danh mục đang hoạt động</span>
              </label>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
                >
                  Hủy
                </button>

                <button
                  disabled={saving}
                  type="submit"
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>

      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
      />
    </div>
  );
}
