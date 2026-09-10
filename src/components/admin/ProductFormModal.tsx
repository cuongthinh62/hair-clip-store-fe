import { useEffect, useState } from "react";
import type { BackendCategory, BackendProduct, ProductFormValues } from "@/types";

interface Props {
  open: boolean;
  initial?: BackendProduct | null;
  categories: BackendCategory[];
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  saving: boolean;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function emptyForm(defaultCategoryId: string): ProductFormValues {
  return {
    categoryId: defaultCategoryId,
    productName: "",
    slug: "",
    material: "",
    description: "",
    wholesalePrice: 0,
    price: 0,
    stockQuantity: 0,
    color: "",
    occasion: "",
    imageUrl: "",
    bestSeller: false,
    isFeatured: false,
    isActive: true,
  };
}

export function ProductFormModal({ open, initial, categories, onClose, onSubmit, saving }: Props) {
  const [values, setValues] = useState<ProductFormValues>(emptyForm(categories[0]?._id ?? ""));
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (initial) {
        setValues({
          categoryId:
            typeof initial.categoryId === "string" ? initial.categoryId : initial.categoryId._id,
          productName: initial.productName,
          slug: initial.slug,
          material: initial.material ?? "",
          description: initial.description ?? "",
          wholesalePrice: Number(initial.wholesalePrice ?? 0),
          price: initial.price ?? 0,
          ...(initial.discountPrice !== undefined ? { discountPrice: initial.discountPrice } : {}),
          stockQuantity: initial.stockQuantity ?? 0,
          color: initial.color ?? "",
          occasion: initial.occasion ?? "",
          imageUrl: initial.imageUrl ?? "",
          bestSeller: initial.bestSeller ?? false,
          isFeatured: initial.isFeatured ?? false,
          isActive: initial.isActive ?? true,
        });
        setSlugTouched(true);
      } else {
        setValues(emptyForm(categories[0]?._id ?? ""));
        setSlugTouched(false);
      }
      setError(null);
    }
  }, [open, initial, categories]);

  if (!open) return null;

  const handleNameChange = (productName: string) => {
    setValues((v) => ({
      ...v,
      productName,
      slug: slugTouched ? v.slug : slugify(productName),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.productName.trim() || !values.slug.trim() || !values.categoryId) {
      setError("Tên sản phẩm, slug và danh mục là bắt buộc");
      return;
    }
    setError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu sản phẩm thất bại");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">{initial ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Danh mục</label>
            <select
              className="w-full rounded-md border px-3 py-2"
              value={values.categoryId}
              onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value }))}
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Tên sản phẩm</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={values.productName}
              onChange={(e) => handleNameChange(e.target.value)}
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
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Chất liệu</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                value={values.material}
                onChange={(e) => setValues((v) => ({ ...v, material: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Màu sắc</label>
              <input
                className="w-full rounded-md border px-3 py-2"
                value={values.color}
                onChange={(e) => setValues((v) => ({ ...v, color: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Giá sỉ (VNĐ)</label>
              <input
                type="number"
                className="w-full rounded-md border px-3 py-2"
                value={values.wholesalePrice}
                onChange={(e) =>
                  setValues((v) => ({ ...v, wholesalePrice: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Giá bán</label>
              <input
                type="number"
                className="w-full rounded-md border px-3 py-2"
                value={values.price}
                onChange={(e) => setValues((v) => ({ ...v, price: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tồn kho</label>
              <input
                type="number"
                className="w-full rounded-md border px-3 py-2"
                value={values.stockQuantity}
                onChange={(e) =>
                  setValues((v) => ({ ...v, stockQuantity: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Ảnh sản phẩm (URL)</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={values.imageUrl}
              onChange={(e) => setValues((v) => ({ ...v, imageUrl: e.target.value }))}
              placeholder="https://..."
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

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.isActive}
                onChange={(e) => setValues((v) => ({ ...v, isActive: e.target.checked }))}
              />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.isFeatured}
                onChange={(e) => setValues((v) => ({ ...v, isFeatured: e.target.checked }))}
              />
              Nổi bật
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.bestSeller}
                onChange={(e) => setValues((v) => ({ ...v, bestSeller: e.target.checked }))}
              />
              Bán chạy
            </label>
          </div>

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
