import { useEffect, useState } from "react";
import type { BackendCategory, CategoryFormValues } from "@/types";

interface Props {
  open: boolean;
  initial?: BackendCategory | null;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  saving: boolean;
}

const emptyForm: CategoryFormValues = {
  categoryName: "",
  slug: "",
  description: "",
  imgUrl: "",
  isActive: true,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryFormModal({ open, initial, onClose, onSubmit, saving }: Props) {
  const [values, setValues] = useState<CategoryFormValues>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValues(
        initial
          ? {
              categoryName: initial.categoryName,
              slug: initial.slug,
              description: initial.description ?? "",
              imgUrl: initial.imgUrl ?? "",
              isActive: initial.isActive,
            }
          : emptyForm,
      );
      setSlugTouched(Boolean(initial));
      setError(null);
    }
  }, [open, initial]);

  if (!open) return null;

  const handleNameChange = (categoryName: string) => {
    setValues((v) => ({
      ...v,
      categoryName,
      slug: slugTouched ? v.slug : slugify(categoryName),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.categoryName.trim() || !values.slug.trim()) {
      setError("Tên danh mục và slug là bắt buộc");
      return;
    }
    setError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu danh mục thất bại");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">{initial ? "Sửa danh mục" : "Thêm danh mục"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Tên danh mục</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={values.categoryName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Kẹp Tóc Con Cua"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Slug</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setValues((v) => ({ ...v, slug: e.target.value }));
              }}
              placeholder="kep-toc-con-cua"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Mô tả</label>
            <textarea
              className="w-full rounded-md border px-3 py-2"
              rows={2}
              value={values.description}
              onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Ảnh đại diện (URL)</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={values.imgUrl}
              onChange={(e) => setValues((v) => ({ ...v, imgUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => setValues((v) => ({ ...v, isActive: e.target.checked }))}
            />
            Đang hoạt động (Active)
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-4 py-2 text-sm"
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
