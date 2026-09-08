import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  CircleDot,
  FolderKanban,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Pencil,
  Plus,
  PlusCircle,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/services/api";
import { catalogService } from "@/services/catalog";
import type { BackendCategory, BackendProduct, Category, Product } from "@/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Tổng quan Quản trị — Thịnh Phát" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "categories" | "products">("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchProductQuery, setSearchProductQuery] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states - Category
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");

  // Form states - Product
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodPrice, setProdPrice] = useState<number | "">("");
  const [prodWholesalePrice, setProdWholesalePrice] = useState<number | "">("");
  const [prodCode, setProdCode] = useState("");
  const [prodColor, setProdColor] = useState("");
  const [prodStatus, setProdStatus] = useState<"selling" | "bestSeller" | "outOfStock">("selling");
  const [prodImage, setProdImage] = useState("");

  // 1. Kiểm tra xác thực (Auth Guard)
  useEffect(() => {
    if (!api.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để truy cập trang quản trị!");
      router.navigate({ to: "/login" });
    }
  }, [router]);

  // 2. Tải dữ liệu từ Backend
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        catalogService.listCategories(),
        catalogService.listProducts({ limit: 100 }),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch {
      toast.error("Lỗi khi tải dữ liệu!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 3. Xử lý Logout: Xoá accessToken và chuyển hướng về /san-pham
  const handleLogout = async () => {
    try {
      await api.logout();
      toast.success("Đã đăng xuất khỏi hệ thống!");
    } catch {
      // ignore
    } finally {
      router.navigate({ to: "/san-pham" });
    }
  };

  // 4. Quản lý Danh mục (Thêm/Sửa/Xóa)
  const handleOpenCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCatName(category.name);
      setCatSlug(category.slug);
      setCatDesc(category.description || "");
    } else {
      setEditingCategory(null);
      setCatName("");
      setCatSlug("");
      setCatDesc("");
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      toast.error("Vui lòng nhập tên danh mục!");
      return;
    }

    try {
      const payload: Partial<BackendCategory> = {
        categoryName: catName.trim(),
        slug: catSlug.trim() || catName.trim().toLowerCase().replace(/\s+/g, "-"),
        description: catDesc.trim(),
        isActive: true,
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await api.createCategory(payload);
        toast.success("Thêm danh mục mới thành công!");
      }

      setIsCategoryModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Thao tác danh mục thất bại");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá danh mục "${name}"?`)) {
      try {
        await api.deleteCategory(id);
        toast.success(`Đã xoá danh mục "${name}"`);
        await loadData();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Không thể xoá danh mục");
      }
    }
  };

  // 5. Quản lý Sản phẩm (Thêm/Sửa/Xóa)
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name);
      setProdCategory(product.categoryId || product.category || (categories[0]?.id ?? ""));
      setProdPrice(product.price ?? "");
      setProdWholesalePrice(product.wholesalePrice ?? "");
      setProdCode(product.productCode || "");
      setProdColor(product.colors.join(", "));
      setProdStatus(
        product.bestSeller
          ? "bestSeller"
          : (product.stockQuantity ?? 0) <= 0
            ? "outOfStock"
            : "selling"
      );
      setProdImage(product.images[0] || "");
    } else {
      setEditingProduct(null);
      setProdName("");
      setProdCategory(categories[0]?.id || "");
      setProdPrice("");
      setProdWholesalePrice("");
      setProdCode("");
      setProdColor("");
      setProdStatus("selling");
      setProdImage("");
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm!");
      return;
    }

    try {
      const payload: Partial<BackendProduct> = {
        productName: prodName.trim(),
        categoryId: prodCategory || categories[0]?.id,
        price: prodPrice === "" ? undefined : Number(prodPrice),
        wholesalePrice: prodWholesalePrice === "" ? undefined : Number(prodWholesalePrice),
        color: prodColor.trim(),
        bestSeller: prodStatus === "bestSeller",
        isFeatured: prodStatus === "bestSeller",
        stockQuantity: prodStatus === "outOfStock" ? 0 : 50,
        imageUrl: prodImage.trim() || undefined,
        isActive: true,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await api.createProduct(payload);
        toast.success("Thêm sản phẩm mới thành công!");
      }

      setIsProductModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Thao tác sản phẩm thất bại");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá sản phẩm "${name}"?`)) {
      try {
        await api.deleteProduct(id);
        toast.success(`Đã xoá sản phẩm "${name}"`);
        await loadData();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Không thể xoá sản phẩm");
      }
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const q = (searchProductQuery || globalSearch).toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.productCode.toLowerCase().includes(q) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-800 antialiased">
      {/* 1. LEFT SIDEBAR */}
      <aside className="sticky top-0 flex h-screen w-60 flex-col justify-between border-r border-slate-200/80 bg-white px-4 py-5 shadow-sm">
        <div className="flex flex-col gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <span className="font-serif text-base font-bold">R</span>
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
                THỊNH PHÁT
              </h2>
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                KẸP TÓC &amp; PHỤ KIỆN
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              HỆ THỐNG
            </p>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => setActiveMenu("dashboard")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  activeMenu === "dashboard"
                    ? "bg-slate-100/90 text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-slate-600" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveMenu("categories")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  activeMenu === "categories"
                    ? "bg-slate-100/90 text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <FolderTree className="h-4 w-4 text-slate-600" />
                <span>Danh mục</span>
              </button>

              <button
                onClick={() => setActiveMenu("products")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  activeMenu === "products"
                    ? "bg-slate-100/90 text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Tag className="h-4 w-4 text-slate-600" />
                <span>Sản phẩm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-sm">
              A
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Admin</p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            title="Đăng xuất và về trang sản phẩm"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-md">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="hover:text-slate-800 cursor-pointer">Trang chủ</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">
              {activeMenu === "dashboard"
                ? "Tổng quan Quản trị"
                : activeMenu === "categories"
                  ? "Quản lý Danh mục"
                  : "Quản lý Sản phẩm"}
            </span>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Tìm kiếm nhanh..."
                className="w-56 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-800 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => toast.info("Không có thông báo mới!")}
              className="relative rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-white">
                A
              </div>
              <span className="text-xs font-semibold text-slate-800">Admin</span>
              <button
                onClick={handleLogout}
                className="ml-1 rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                title="Đăng xuất"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 space-y-6 p-6 sm:p-8">
          {/* Title & Action Buttons Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {activeMenu === "dashboard"
                  ? "Tổng quan Quản trị"
                  : activeMenu === "categories"
                    ? "Quản lý Danh mục"
                    : "Quản lý Sản phẩm"}
              </h1>
              <p className="text-xs text-slate-500">
                Quản lý trực tiếp danh mục phân loại và danh sách sản phẩm kẹp tóc &amp; phụ kiện.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleOpenCategoryModal()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
              >
                <PlusCircle className="h-4 w-4 text-slate-600" />
                <span>Thêm danh mục mới</span>
              </button>

              <button
                onClick={() => handleOpenProductModal()}
                className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm sản phẩm mới</span>
              </button>
            </div>
          </div>

          {/* CARD 1: QUẢN LÝ DANH MỤC */}
          {(activeMenu === "dashboard" || activeMenu === "categories") && (
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Quản lý Danh mục</h3>
                    <p className="text-[11px] text-slate-400">
                      Phân nhóm kẹp tóc &amp; phụ kiện lưu kho
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <button
                    onClick={() => handleOpenCategoryModal()}
                    className="font-medium text-slate-600 hover:text-slate-900"
                  >
                    + Thêm danh mục mới
                  </button>
                  <button
                    onClick={() => setActiveMenu("categories")}
                    className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                  >
                    <span>Đến trang Danh mục</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Categories Table */}
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="py-3 px-2">TÊN DANH MỤC</th>
                      <th className="py-3 px-2 text-center">SỐ LƯỢNG SẢN PHẨM</th>
                      <th className="py-3 px-2 text-center">TRẠNG THÁI</th>
                      <th className="py-3 px-2 text-right">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          <RefreshCw className="mx-auto mb-1.5 h-4 w-4 animate-spin" />
                          Đang tải danh mục...
                        </td>
                      </tr>
                    ) : categories.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400">
                          Chưa có danh mục nào
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat) => {
                        const count = products.filter(
                          (p) => p.category === cat.slug || p.categoryId === cat.id
                        ).length;

                        return (
                          <tr key={cat.id} className="transition-colors hover:bg-slate-50/60">
                            <td className="py-3 px-2 font-medium text-slate-800">
                              <div className="flex items-center gap-2.5">
                                <CircleDot className="h-3.5 w-3.5 text-slate-500" />
                                <span>{cat.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-center text-slate-600">
                              {count} sản phẩm
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="inline-block rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-700">
                                Đang hoạt động
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <div className="inline-flex items-center gap-2 text-slate-400">
                                <button
                                  onClick={() => handleOpenCategoryModal(cat)}
                                  className="rounded p-1 hover:bg-slate-100 hover:text-slate-700"
                                  title="Chỉnh sửa"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                  className="rounded p-1 hover:bg-rose-50 hover:text-rose-600"
                                  title="Xoá"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* CARD 2: QUẢN LÝ SẢN PHẨM */}
          {(activeMenu === "dashboard" || activeMenu === "products") && (
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              {/* Card Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Quản lý Sản phẩm</h3>
                    <p className="text-[11px] text-slate-400">
                      Danh sách sản phẩm tiêu biểu và mới nhất
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchProductQuery}
                      onChange={(e) => setSearchProductQuery(e.target.value)}
                      placeholder="Tìm kiếm nhanh tên, SKU..."
                      className="w-56 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-800 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => handleOpenProductModal()}
                    className="flex items-center gap-1 rounded-xl bg-slate-950 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Thêm sản phẩm mới</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="py-3 px-2">SẢN PHẨM &amp; SKU</th>
                      <th className="py-3 px-2">DANH MỤC</th>
                      <th className="py-3 px-2">GIÁ SỈ (VNĐ)</th>
                      <th className="py-3 px-2 text-center">TRẠNG THÁI</th>
                      <th className="py-3 px-2 text-right">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          <RefreshCw className="mx-auto mb-1.5 h-4 w-4 animate-spin" />
                          Đang tải sản phẩm...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          Không tìm thấy sản phẩm nào
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.slice(0, 15).map((prod) => {
                        const isOutOfStock = (prod.stockQuantity ?? 0) <= 0;
                        const isBestSeller = prod.bestSeller;

                        return (
                          <tr key={prod.id} className="transition-colors hover:bg-slate-50/60">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.images[0]}
                                  alt={prod.name}
                                  className="h-10 w-10 rounded-lg border border-slate-100 object-cover"
                                />
                                <div>
                                  <p className="font-semibold text-slate-900 leading-tight">
                                    {prod.name}
                                  </p>
                                  <p className="text-[10px] font-mono text-slate-400">
                                    SKU: {prod.productCode}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-slate-600 font-medium">
                              {prod.categoryName || prod.category}
                            </td>
                            <td className="py-3 px-2 font-semibold text-slate-900">
                              {prod.wholesalePrice
                                ? `${prod.wholesalePrice.toLocaleString("vi-VN")} đ`
                                : prod.price
                                  ? `${prod.price.toLocaleString("vi-VN")} đ`
                                  : "Liên hệ"}
                            </td>
                            <td className="py-3 px-2 text-center">
                              {isBestSeller ? (
                                <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700">
                                  Bán chạy
                                </span>
                              ) : isOutOfStock ? (
                                <span className="inline-block rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-700">
                                  Tạm hết
                                </span>
                              ) : (
                                <span className="inline-block rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-700">
                                  Đang bán
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <div className="inline-flex items-center gap-2 text-slate-400">
                                <button
                                  onClick={() => handleOpenProductModal(prod)}
                                  className="rounded p-1 hover:bg-slate-100 hover:text-slate-700"
                                  title="Chỉnh sửa"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  className="rounded p-1 hover:bg-rose-50 hover:text-rose-600"
                                  title="Xoá"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Card Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                <span>Hiển thị các sản phẩm mới nhất trong kho</span>
                <button
                  onClick={() => setActiveMenu("products")}
                  className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                >
                  <span>Xem toàn bộ danh sách sản phẩm</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* MODAL: THÊM / SỬA DANH MỤC */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tên danh mục *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Ví dụ: Kẹp càng cua"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-slate-800 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Slug (Đường dẫn)</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="kep-cang-cua (để trống tự tạo)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Mô tả danh mục</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={2}
                  placeholder="Mô tả ngắn phân loại..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-3.5 py-2 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-800"
                >
                  {editingCategory ? "Lưu thay đổi" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM / SỬA SẢN PHẨM */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ví dụ: Kẹp Càng Cua Ngọc Trai Pháp 8cm"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-slate-800 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Danh mục *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-slate-800 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Trạng thái</label>
                  <select
                    value={prodStatus}
                    onChange={(e) =>
                      setProdStatus(e.target.value as "selling" | "bestSeller" | "outOfStock")
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-slate-800 focus:outline-none"
                  >
                    <option value="selling">Đang bán</option>
                    <option value="bestSeller">Bán chạy</option>
                    <option value="outOfStock">Tạm hết</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Giá sỉ (VNĐ)</label>
                  <input
                    type="number"
                    value={prodWholesalePrice}
                    onChange={(e) =>
                      setProdWholesalePrice(e.target.value ? Number(e.target.value) : "")
                    }
                    placeholder="18500"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Giá bán lẻ (VNĐ)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value ? Number(e.target.value) : "")}
                    placeholder="35000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Màu sắc (cách nhau bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={prodColor}
                  onChange={(e) => setProdColor(e.target.value)}
                  placeholder="Trắng ngọc trai, Vàng hổ phách"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">URL Hình ảnh</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://... (để trống dùng ảnh mặc định)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-3.5 py-2 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-800"
                >
                  {editingProduct ? "Lưu thay đổi" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

