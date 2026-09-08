import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/services/api";
import { catalogService } from "@/services/catalog";
import type { Category, Product } from "@/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Bảng điều khiển Quản trị — Thịnh Phát" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "overview">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Kiểm tra quyền truy cập (Auth Guard)
  useEffect(() => {
    if (!api.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để truy cập trang quản trị!");
      router.navigate({ to: "/login" });
    }
  }, [router]);

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
      toast.error("Lỗi khi tải dữ liệu từ máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Xử lý Logout theo yêu cầu: Xoá accessToken và chuyển về /san-pham
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.logout();
      toast.success("Đã đăng xuất khỏi hệ thống!");
      // Chuyển hướng về trang sản phẩm mặc định
      router.navigate({ to: "/san-pham" });
    } catch {
      toast.error("Có lỗi khi đăng xuất, đã tự động xoá phiên làm việc!");
      router.navigate({ to: "/san-pham" });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "all" ||
      p.category === selectedCategory ||
      p.categoryId === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-100/70 font-sans text-slate-800 antialiased">
      {/* Admin Top Navigation Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <span className="font-serif text-base font-bold">R</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wide text-slate-900 uppercase">
                THỊNH PHÁT
              </span>
              <span className="rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Hệ thống Quản lý Bán sỉ &amp; Kho hàng</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Phiên làm việc bảo mật</span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-3.5 py-2 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 hover:text-rose-800 active:scale-95 disabled:opacity-50"
            title="Đăng xuất và quay về trang sản phẩm"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Admin Body Container */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Tổng sản phẩm</span>
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{products.length}</p>
            <span className="text-[11px] text-slate-400">Đang lưu hành trong hệ thống</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Tổng danh mục</span>
              <FolderTree className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{categories.length}</p>
            <span className="text-[11px] text-slate-400">Phân loại kẹp &amp; phụ kiện</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Sản phẩm nổi bật</span>
              <Tag className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {products.filter((p) => p.featured).length}
            </p>
            <span className="text-[11px] text-slate-400">Hiển thị ngoài trang chủ</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Bán chạy nhất</span>
              <LayoutDashboard className="h-4 w-4 text-purple-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {products.filter((p) => p.bestSeller).length}
            </p>
            <span className="text-[11px] text-slate-400">Gắn tag Best Seller</span>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "products"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Package className="h-3.5 w-3.5" />
                <span>Quản lý Sản phẩm ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("categories")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "categories"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <FolderTree className="h-3.5 w-3.5" />
                <span>Danh mục ({categories.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Làm mới</span>
              </button>
            </div>
          </div>

          {/* Controls when in Products Tab */}
          {activeTab === "products" && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên sản phẩm hoặc mã TP-..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-slate-800 focus:outline-none"
                >
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Tab Content: Products Table */}
        {activeTab === "products" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/80 font-semibold text-slate-600">
                  <tr>
                    <th className="px-5 py-3.5">Sản phẩm</th>
                    <th className="px-4 py-3.5">Mã SP</th>
                    <th className="px-4 py-3.5">Danh mục</th>
                    <th className="px-4 py-3.5">Giá bán lẻ / Sỉ</th>
                    <th className="px-4 py-3.5">Tồn kho</th>
                    <th className="px-4 py-3.5">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <RefreshCw className="mx-auto mb-2 h-6 w-6 animate-spin text-slate-400" />
                        Đang tải danh sách sản phẩm...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Không tìm thấy sản phẩm nào phù hợp
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => (
                      <tr key={prod.id} className="transition-colors hover:bg-slate-50/60">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="h-10 w-10 rounded-lg object-cover border border-slate-100"
                            />
                            <div>
                              <p className="font-semibold text-slate-800">{prod.name}</p>
                              <p className="text-[11px] text-slate-400 line-clamp-1">
                                {prod.colors.join(", ")}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-mono font-medium text-slate-600">
                          {prod.productCode}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                            {prod.categoryName || prod.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-900">
                            {prod.price ? `${prod.price.toLocaleString("vi-VN")} đ` : "Liên hệ sỉ"}
                          </p>
                          {prod.wholesalePrice && (
                            <p className="text-[10px] text-emerald-600 font-medium">
                              Sỉ: {prod.wholesalePrice.toLocaleString("vi-VN")} đ
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                              (prod.stockQuantity ?? 0) > 0
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {(prod.stockQuantity ?? 0) > 0
                              ? `Còn ${prod.stockQuantity} cái`
                              : "Liên hệ"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {prod.featured && (
                              <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
                                Nổi bật
                              </span>
                            )}
                            {prod.bestSeller && (
                              <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                                Bán chạy
                              </span>
                            )}
                            {!prod.featured && !prod.bestSeller && (
                              <span className="text-[11px] text-slate-400">Bình thường</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Categories Table */}
        {activeTab === "categories" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-14 w-14 rounded-xl object-cover border border-slate-100"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{c.name}</h3>
                  <p className="text-[11px] font-mono text-slate-400">Slug: {c.slug}</p>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-1">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
