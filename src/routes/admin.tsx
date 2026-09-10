import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { api } from "@/services/api";
import { mapBackendCategory, mapBackendProduct } from "@/services/catalog";
import type { BackendCategory, BackendProduct, Category, Product } from "@/types";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (!api.isAuthenticated()) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Quản trị hệ thống — Thịnh Phát" }] }),
  component: AdminPage,
});

type Section = "products" | "categories";

function AdminPage() {
  const [section, setSection] = useState<Section>("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>();
  const [editingCategory, setEditingCategory] = useState<Category | null | undefined>();
  const [saving, setSaving] = useState(false);
  const pageSize = 7;

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoryResponse, firstPage] = await Promise.all([
        api.getCategories(),
        api.getProducts({ page: 1, limit: 100 }),
      ]);
      const totalPages = firstPage.pagination?.totalPages ?? 1;
      const pages = await Promise.all(
        Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) =>
          api.getProducts({ page: index + 2, limit: 100 }),
        ),
      );
      const categoryDocs = categoryResponse.data ?? [];
      const nextCategories = categoryDocs.map(mapBackendCategory);
      const allProducts = [firstPage, ...pages].flatMap((response) => response.data ?? []);
      const nextProducts = allProducts.map((doc) => {
        const product = mapBackendProduct(doc);
        const category = nextCategories.find(
          (item) => item.id === product.categoryId || item.slug === product.category,
        );
        return category
          ? { ...product, category: category.slug, categoryName: category.name }
          : product;
      });
      setCategories(nextCategories);
      setProducts(nextProducts);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tải dữ liệu từ máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.productCode} ${product.categoryName ?? product.category}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      const matchesCategory =
        categoryFilter === "all" ||
        product.categoryId === categoryFilter ||
        product.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? productIsActive(product) : !productIsActive(product));
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [products, query, categoryFilter, statusFilter]);

  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const productCountForCategory = (category: Category) =>
    products.filter(
      (product) => product.categoryId === category.id || product.category === category.slug,
    ).length;

  useEffect(() => {
    setPage(1);
  }, [query, categoryFilter, statusFilter, section]);

  const saveProduct = async (data: Partial<BackendProduct>) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, data);
        toast.success("Đã cập nhật sản phẩm");
      } else {
        await api.createProduct(data);
        toast.success("Đã thêm sản phẩm");
      }
      setEditingProduct(undefined);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  const saveCategory = async (data: Partial<BackendCategory>) => {
    setSaving(true);
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, data);
        toast.success("Đã cập nhật danh mục");
      } else {
        await api.createCategory(data);
        toast.success("Đã thêm danh mục");
      }
      setEditingCategory(undefined);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu danh mục");
    } finally {
      setSaving(false);
    }
  };

  const removeProducts = async (ids: string[]) => {
    if (!ids.length || !window.confirm(`Bạn có chắc muốn xóa ${ids.length} sản phẩm đã chọn?`))
      return;
    setSaving(true);
    try {
      await Promise.all(ids.map((id) => api.deleteProduct(id)));
      setSelected([]);
      toast.success(`Đã xóa ${ids.length} sản phẩm`);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await api.logout();
    window.location.href = "/san-pham";
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#172033]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[248px] border-r border-[#e7ebf2] bg-white transition-transform lg:translate-x-0 ${
          mobileNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-[#eef1f6] px-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#152033] text-xs font-bold text-white">
            TP
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold uppercase tracking-wide">THỊNH PHÁT</p>
            <p className="truncate text-[10px] text-slate-400">Kẹp Tóc & Phụ Kiện</p>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setMobileNav(false)}
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Quản lý kho & hàng
          </p>
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" />
          <SidebarItem
            icon={<Package />}
            label="Sản phẩm"
            active={section === "products"}
            onClick={() => {
              setSection("products");
              setMobileNav(false);
            }}
          />
          <SidebarItem
            icon={<FolderTree />}
            label="Danh mục"
            active={section === "categories"}
            onClick={() => {
              setSection("categories");
              setMobileNav(false);
            }}
          />
          <div className="my-6 border-t border-[#eef1f6]" />
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Hệ thống
          </p>
          <SidebarItem icon={<Settings />} label="Cài đặt" />
          <SidebarItem icon={<CircleHelp />} label="Trợ giúp" />
        </div>
        <div className="absolute inset-x-0 bottom-0 border-t border-[#eef1f6] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#f1e5d7] text-xs font-bold text-[#73512f]">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold">Admin</p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
            <button onClick={() => void logout()} title="Đăng xuất">
              <LogOut className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:ml-[248px]">
        <header className="flex h-[76px] items-center justify-between border-b border-[#e7ebf2] bg-white px-5 sm:px-8">
          <button className="lg:hidden" onClick={() => setMobileNav(true)} aria-label="Mở menu">
            <Menu />
          </button>
          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="font-medium text-slate-600">Quản trị hệ thống</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden w-64 items-center gap-2 rounded-lg bg-[#f6f8fb] px-3 py-2 text-xs text-slate-400 md:flex">
              <Search className="h-4 w-4" />
              <span>Tìm kiếm SKU, tên kép tóc...</span>
            </div>
            <Bell className="h-4 w-4 text-slate-500" />
            <div className="hidden h-7 w-7 place-items-center rounded-full bg-[#f1e5d7] text-[10px] font-bold sm:grid">
              AD
            </div>
            <span className="hidden text-xs font-medium sm:block">Admin</span>
          </div>
        </header>

        <div className="p-5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {section === "products" ? "Sản phẩm (Products)" : "Danh mục (Categories)"}
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                {section === "products"
                  ? "Manage your products, inventory status, and wholesale pricing with real-time sync."
                  : "Quản lý danh mục sản phẩm và trạng thái hiển thị."}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => void loadData()}
                className="inline-flex items-center gap-2 rounded-lg border border-[#dfe5ee] bg-white px-3 py-2.5 text-xs font-semibold hover:bg-slate-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Làm mới
              </button>
              <button
                onClick={() =>
                  section === "products" ? setEditingProduct(null) : setEditingCategory(null)
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[#080b10] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                {section === "products" ? "Thêm sản phẩm" : "Thêm danh mục"}
              </button>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-2 overflow-x-auto">
            <div className="flex min-w-[230px] flex-1 items-center gap-2 rounded-lg border border-[#e0e6ef] bg-white px-3 py-2.5">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  section === "products"
                    ? "Search products by name, sku..."
                    : "Tìm tên hoặc slug danh mục..."
                }
                className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
              />
            </div>
            {section === "products" ? (
              <>
                <FilterSelect
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  label="Tất cả danh mục (All)"
                  options={categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                />
                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  label="All Status"
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </>
            ) : null}
            {selected.length > 0 && section === "products" ? (
              <button
                onClick={() => void removeProducts(selected)}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Xóa ({selected.length})
              </button>
            ) : null}
          </div>

          {section === "products" ? (
            <ProductTable
              products={visibleProducts}
              loading={loading}
              selected={selected}
              onSelect={setSelected}
              onEdit={setEditingProduct}
              onDelete={(product) => void removeProducts([product.id])}
            />
          ) : (
            <CategoryTable
              categories={categories.filter(
                (category) =>
                  !query ||
                  `${category.name} ${category.slug}`.toLowerCase().includes(query.toLowerCase()),
              )}
              products={products}
              loading={loading}
              onEdit={setEditingCategory}
              onDelete={async (category) => {
                if (!window.confirm(`Xóa danh mục "${category.name}"?`)) return;
                try {
                  await api.deleteCategory(category.id);
                  toast.success("Đã xóa danh mục");
                  await loadData();
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Không thể xóa danh mục");
                }
              }}
            />
          )}

          {section === "products" && (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={filteredProducts.length}
              pageSize={pageSize}
              onPage={setPage}
            />
          )}
        </div>
      </main>

      {editingProduct !== undefined && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          saving={saving}
          onClose={() => setEditingProduct(undefined)}
          onSave={(data) => void saveProduct(data)}
        />
      )}
      {editingCategory !== undefined && (
        <CategoryForm
          category={editingCategory}
          saving={saving}
          onClose={() => setEditingCategory(undefined)}
          onSave={(data) => void saveCategory(data)}
        />
      )}
    </div>
  );
}

function productIsActive(product: Product) {
  return product.isActive ?? (product.stockQuantity !== undefined && product.stockQuantity > 0);
}

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-colors ${active ? "bg-[#f0f3f8] text-[#152033]" : "text-slate-500 hover:bg-slate-50"}`}
    >
      {<span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      {label}
    </button>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-lg border border-[#e0e6ef] bg-white py-2.5 pl-3 pr-8 text-xs text-slate-600 outline-none"
      >
        {<option value="all">{label}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
    </div>
  );
}

function ProductTable({
  products,
  loading,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  products: Product[];
  loading: boolean;
  selected: string[];
  onSelect: (ids: string[]) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  const allSelected =
    products.length > 0 && products.every((product) => selected.includes(product.id));
  const toggleAll = () =>
    onSelect(
      allSelected
        ? selected.filter((id) => !products.some((product) => product.id === id))
        : [...new Set([...selected, ...products.map((product) => product.id)])],
    );
  return (
    <div className="overflow-hidden rounded-xl border border-[#e3e8f0] bg-white shadow-[0_2px_10px_rgba(30,50,80,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-xs">
          <thead className="bg-[#f6f8fc] text-[10px] font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-12 px-3 py-4 text-center">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="px-3 py-4">Sản phẩm (Product)</th>
              <th className="px-3 py-4">Danh mục</th>
              <th className="px-3 py-4">Chất liệu</th>
              <th className="px-3 py-4">Giá sỉ (VNĐ)</th>
              <th className="px-3 py-4">Trạng thái</th>
              <th className="px-3 py-4">Cập nhật</th>
              <th className="px-3 py-4" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400">
                  Không có sản phẩm phù hợp.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-[#eef1f5] hover:bg-[#fbfcfe]">
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() =>
                        onSelect(
                          selected.includes(product.id)
                            ? selected.filter((id) => id !== product.id)
                            : [...selected, product.id],
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt=""
                        className="h-10 w-10 rounded-md border border-slate-100 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-700">{product.name}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{product.productCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-[#edf3ff] px-2.5 py-1 text-[10px] font-semibold text-[#5873a1]">
                      {product.categoryName || product.category || "Chưa phân loại"}
                    </span>
                  </td>
                  <td className="max-w-[150px] truncate px-3 py-3 text-slate-500">
                    {product.material || "—"}
                  </td>
                  <td className="px-3 py-3 font-bold text-slate-700">
                    {(product.wholesalePrice ?? product.price)?.toLocaleString("vi-VN") ?? "—"}
                    <span className="font-normal">đ</span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${productIsActive(product) ? "bg-[#e7f8f1] text-[#2d9b6b]" : "bg-[#eef1f5] text-slate-500"}`}
                    >
                      {productIsActive(product) ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-400">
                    {formatDate(product.id)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => onEdit(product)}
                      className="mr-2 rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Sửa"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Xóa"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryTable({
  categories,
  products,
  loading,
  onEdit,
  onDelete,
}: {
  categories: Category[];
  products: Product[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e3e8f0] bg-white">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#f6f8fc] text-[10px] font-bold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-4">Tên danh mục</th>
            <th className="px-5 py-4">Slug</th>
            <th className="px-5 py-4">Sản phẩm</th>
            <th className="px-5 py-4">Trạng thái</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="py-16 text-center text-slate-400">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id} className="border-t border-[#eef1f5]">
                <td className="px-5 py-4 font-semibold">{category.name}</td>
                <td className="px-5 py-4 text-slate-500">{category.slug}</td>
                <td className="px-5 py-4">
                  {
                    products.filter(
                      (product) =>
                        product.categoryId === category.id || product.category === category.slug,
                    ).length
                  }
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-[#e7f8f1] px-2.5 py-1 text-[10px] font-semibold text-[#2d9b6b]">
                    Active
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => onEdit(category)}
                    className="mr-3 text-slate-500 hover:text-slate-900"
                  >
                    Sửa
                  </button>
                  <button onClick={() => onDelete(category)} className="text-red-500">
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
}) {
  const from = total ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-4 text-xs text-slate-500">
      <span>
        Hiển thị{" "}
        <b className="text-slate-700">
          {from}-{to}
        </b>{" "}
        trên <b className="text-slate-700">{total}</b> sản phẩm
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
          className="rounded border border-[#e1e6ee] p-1.5 disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
          <button
            key={item}
            onClick={() => onPage(item)}
            className={`h-7 min-w-7 rounded px-2 text-xs ${item === page ? "bg-[#080b10] font-semibold text-white" : "hover:bg-slate-100"}`}
          >
            {item}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => onPage(page + 1)}
          className="rounded border border-[#e1e6ee] p-1.5 disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  categories,
  saving,
  onClose,
  onSave,
}: {
  product: Product | null;
  categories: Category[];
  saving: boolean;
  onClose: () => void;
  onSave: (data: Partial<BackendProduct>) => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [wholesalePrice, setWholesalePrice] = useState(String(product?.wholesalePrice ?? ""));
  const [stock, setStock] = useState(String(product?.stockQuantity ?? 0));
  const [material, setMaterial] = useState(product?.material ?? "");
  const [color, setColor] = useState(product?.colors.join(", ") ?? "");
  const [imageUrl, setImageUrl] = useState(product?.images[0] ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  return (
    <Modal title={product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim() || !categoryId) {
            toast.error("Vui lòng nhập tên và chọn danh mục");
            return;
          }
          onSave({
            productName: name.trim(),
            categoryId,
            slug: product?.slug || slugify(name),
            price: Number(price) || 0,
            wholesalePrice: Number(wholesalePrice) || 0,
            stockQuantity: Number(stock) || 0,
            material: material.trim(),
            color: color.trim(),
            imageUrl: imageUrl.trim(),
            description: description.trim(),
            isActive: Number(stock) > 0,
          });
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="Tên sản phẩm" required>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="form-input"
          />
        </Field>
        <Field label="Danh mục" required>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="form-input"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Giá bán (VNĐ)">
          <input
            type="number"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Giá sỉ (VNĐ)">
          <input
            type="number"
            min="0"
            value={wholesalePrice}
            onChange={(event) => setWholesalePrice(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Tồn kho">
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Chất liệu">
          <input
            value={material}
            onChange={(event) => setMaterial(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Màu sắc">
          <input
            value={color}
            onChange={(event) => setColor(event.target.value)}
            placeholder="Nâu, Đen, Trắng"
            className="form-input"
          />
        </Field>
        <Field label="URL hình ảnh">
          <input
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Mô tả" wide>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="form-input resize-none"
          />
        </Field>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-xs font-semibold"
          >
            Hủy
          </button>
          <button
            disabled={saving}
            className="rounded-lg bg-[#080b10] px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CategoryForm({
  category,
  saving,
  onClose,
  onSave,
}: {
  category: Category | null;
  saving: boolean;
  onClose: () => void;
  onSave: (data: Partial<BackendCategory>) => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  return (
    <Modal title={category ? "Chỉnh sửa danh mục" : "Thêm danh mục"} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) {
            toast.error("Vui lòng nhập tên danh mục");
            return;
          }
          onSave({
            categoryName: name.trim(),
            slug: slugify(slug || name),
            description: description.trim(),
            imgUrl: image.trim(),
            isActive: true,
          });
        }}
        className="space-y-4"
      >
        <Field label="Tên danh mục" required>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="form-input"
          />
        </Field>
        <Field label="Slug">
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="URL hình ảnh">
          <input
            type="url"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Mô tả">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="form-input resize-none"
          />
        </Field>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-xs font-semibold"
          >
            Hủy
          </button>
          <button
            disabled={saving}
            className="rounded-lg bg-[#080b10] px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu danh mục"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  required,
  wide,
  children,
}: {
  label: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Đóng">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDate(id: string) {
  return id.length > 10
    ? new Date(Number.parseInt(id.slice(-8), 16) * 1000).toLocaleDateString("vi-VN")
    : "—";
}
