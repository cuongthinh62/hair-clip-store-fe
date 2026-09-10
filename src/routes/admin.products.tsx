import { createFileRoute } from "@tanstack/react-router";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
  type Category,
  type Product,
} from "@/services/adminApi";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const pageSize = 7;

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      // Lấy song song dữ liệu danh mục và sản phẩm
      const [productData, categoryData] = await Promise.all([getProducts(), getCategories()]);

      setProducts(productData);
      setCategories(categoryData);
    } catch (err: any) {
      setError(err?.message || "Không thể tải dữ liệu sản phẩm");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Xử lý Lọc Client-Side chuẩn xác hơn
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      // Extract Category ID từ String hoặc Populated Object
      const categoryId =
        typeof product.categoryId === "string" ? product.categoryId : product.categoryId?._id;

      // 1. Lọc theo tên hoặc slug
      const matchesSearch =
        !keyword ||
        product.productName?.toLowerCase().includes(keyword) ||
        product.slug?.toLowerCase().includes(keyword);

      // 2. Lọc theo danh mục
      const matchesCategory = categoryFilter === "all" || categoryId === categoryFilter;

      // 3. Lọc theo trạng thái (Active / Inactive)
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? product.isActive === true : product.isActive === false);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Reset về trang 1 khi đổi bộ lọc
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter]);

  // Helper lấy tên Danh mục chuẩn kể cả khi là String ID hay Object
  function getCategoryName(product: Product) {
    if (typeof product.categoryId !== "string" && product.categoryId?.categoryName) {
      return product.categoryId.categoryName;
    }

    const catId =
      typeof product.categoryId === "string" ? product.categoryId : product.categoryId?._id;

    const category = categories.find((item) => item._id === catId);
    return category?.categoryName || "Không có danh mục";
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setModalOpen(true);
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa "${product.productName}"?`);
    if (!confirmed) return;

    try {
      setSaving(true);
      await deleteProduct(product._id);
      await loadData();
    } catch (err: any) {
      alert(err?.message || "Xóa sản phẩm thất bại");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const getNumber = (name: string) => {
      const val = formData.get(name);
      return val !== null && val !== "" ? Number(val) : 0;
    };

    const categoryId = String(formData.get("categoryId") || "").trim();
    const productName = String(formData.get("productName") || "").trim();
    const price = getNumber("price");

    if (!productName) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (!categoryId) {
      alert("Vui lòng chọn danh mục");
      return;
    }

    const slug = String(formData.get("slug") || "").trim();
    const data: Partial<Product> = {
      categoryId,
      productName,
      ...(slug ? { slug } : {}),
      material: String(formData.get("material") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      wholesalePrice: getNumber("wholesalePrice"),
      price,
      discountPrice: getNumber("discountPrice"),
      stockQuantity: getNumber("stockQuantity"),
      color: String(formData.get("color") || "").trim(),
      occasion: String(formData.get("occasion") || "").trim(),
      imageUrl: String(formData.get("imageUrl") || "").trim(),
      bestSeller: formData.get("bestSeller") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      // Đảm bảo tạo mới nếu không đụng tới checkbox thì mặc định active = true
      isActive: formData.get("isActive") === "on",
    };

    try {
      setSaving(true);

      if (editing) {
        await updateProduct(editing._id, data);
      } else {
        await createProduct(data);
      }

      setModalOpen(false);
      setEditing(null);
      await loadData();
    } catch (err: any) {
      alert(err?.message || "Không thể lưu sản phẩm");
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
            <h1 className="text-2xl font-bold tracking-tight">Sản phẩm (Products)</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredProducts.length} / {products.length} SKU
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý danh sách sản phẩm, tồn kho và danh mục.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* BỘ LỌC (FILTER) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          {/* Lọc theo Tên/Slug */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên hoặc slug sản phẩm..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:bg-white focus:border-slate-400"
            />
          </div>

          {/* Lọc theo Danh mục */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-slate-400"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>

          {/* Lọc theo Trạng thái (Active / Inactive) */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-slate-400"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động (Active)</option>
            <option value="inactive">Ngưng hoạt động (Inactive)</option>
          </select>

          {/* Reset Bộ lọc */}
          <button
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
              setStatusFilter("all");
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            ↻ Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {/* THÔNG BÁO LỖI */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* BẢNG DỮ LIỆU */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                <th className="w-12 px-4 py-4">
                  <input type="checkbox" className="h-4 w-4" />
                </th>
                <th className="px-4 py-4">Sản phẩm</th>
                <th className="px-4 py-4">Danh mục</th>
                <th className="px-4 py-4">Chất liệu</th>
                <th className="px-4 py-4">Giá bán (VNĐ)</th>
                <th className="px-4 py-4">Trạng thái</th>
                <th className="px-4 py-4">Cập nhật</th>
                <th className="px-4 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-20 text-center text-sm text-slate-400">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : visibleProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-20 text-center text-sm text-slate-400">
                    Không tìm thấy sản phẩm khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                visibleProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-4">
                      <input type="checkbox" className="h-4 w-4" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.productName}
                            className="h-11 w-11 rounded-lg border border-slate-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
                            📦
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="max-w-[220px] truncate text-sm font-semibold text-slate-800">
                            {product.productName}
                          </div>
                          <div className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                            {product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        {getCategoryName(product)}
                      </span>
                    </td>
                    <td className="max-w-[160px] px-4 py-4 text-sm text-slate-500">
                      <div className="truncate">{product.material || "—"}</div>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-700">
                      {formatMoney(product.price)}
                    </td>
                    <td className="px-4 py-4">
                      {product.isActive ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {formatDate(product.updatedAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                        >
                          Sửa
                        </button>
                        <button
                          disabled={saving}
                          onClick={() => handleDelete(product)}
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

        {/* PHÂN TRANG */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <div className="text-xs text-slate-500">
            Hiển thị{" "}
            <strong>{filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong>{" "}
            - <strong>{Math.min(currentPage * pageSize, filteredProducts.length)}</strong> trên{" "}
            <strong>{filteredProducts.length}</strong> sản phẩm
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs disabled:opacity-40"
            >
              ‹ Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                onClick={() => setPage(number)}
                className={`h-9 min-w-9 rounded-lg px-3 text-xs font-semibold ${
                  number === currentPage
                    ? "bg-black text-white"
                    : "border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {number}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs disabled:opacity-40"
            >
              Next ›
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">Nhập thông tin sản phẩm.</p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="text-xl text-slate-400 hover:text-black"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Tên sản phẩm *"
                  name="productName"
                  defaultValue={editing?.productName ?? ""}
                  required
                />

                <Field label="Slug" name="slug" defaultValue={editing?.slug ?? ""} />

                <div>
                  <label className="mb-2 block text-sm font-semibold">Danh mục *</label>
                  <select
                    name="categoryId"
                    defaultValue={
                      typeof editing?.categoryId === "string"
                        ? editing.categoryId
                        : editing?.categoryId?._id || ""
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <Field
                  label="Chất liệu"
                  name="material"
                  defaultValue={editing?.material ?? ""}
                  placeholder="Nhựa cao cấp"
                />

                <Field
                  label="Giá bán *"
                  name="price"
                  type="number"
                  defaultValue={editing?.price !== undefined ? String(editing.price) : ""}
                  required
                />

                <Field
                  label="Giá sỉ"
                  name="wholesalePrice"
                  type="number"
                  defaultValue={
                    editing?.wholesalePrice !== undefined ? String(editing.wholesalePrice) : ""
                  }
                />

                <Field
                  label="Giá giảm"
                  name="discountPrice"
                  type="number"
                  defaultValue={
                    editing?.discountPrice !== undefined ? String(editing.discountPrice) : ""
                  }
                />

                <Field
                  label="Số lượng tồn kho"
                  name="stockQuantity"
                  type="number"
                  defaultValue={
                    editing?.stockQuantity !== undefined ? String(editing.stockQuantity) : "0"
                  }
                />

                <Field label="Màu sắc" name="color" defaultValue={editing?.color ?? ""} />

                <Field label="Dịp sử dụng" name="occasion" defaultValue={editing?.occasion ?? ""} />
              </div>

              <Field
                label="URL hình ảnh"
                name="imageUrl"
                defaultValue={editing?.imageUrl || ""}
                placeholder="https://..."
              />

              <div>
                <label className="mb-2 block text-sm font-semibold">Mô tả</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editing?.description || ""}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex flex-wrap gap-6 rounded-xl bg-slate-50 p-4">
                <CheckBox
                  name="bestSeller"
                  label="Best Seller"
                  defaultChecked={editing?.bestSeller || false}
                />

                <CheckBox
                  name="isFeatured"
                  label="Sản phẩm nổi bật"
                  defaultChecked={editing?.isFeatured || false}
                />

                <CheckBox
                  name="isActive"
                  label="Đang hoạt động"
                  defaultChecked={editing ? editing.isActive : true}
                />
              </div>

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
                  {saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo sản phẩm"}
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
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
      />
    </div>
  );
}

function CheckBox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4" />
      {label}
    </label>
  );
}

function formatMoney(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }
  try {
    return new Date(value).toLocaleDateString("vi-VN");
  } catch {
    return "—";
  }
}
