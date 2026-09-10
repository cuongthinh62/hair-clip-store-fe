import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { api } from "@/services/api";
import { catalogService } from "@/services/catalog";
import type { BackendCategory, BackendProduct, Category, Product } from "@/types";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (!api.isAuthenticated()) throw redirect({ to: "/login" });
  },
  component: AdminPage,
});

type Section = "categories" | "products";

function AdminPage() {
  const [section, setSection] = useState<Section>("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [productCategory, setProductCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [nextCategories, nextProducts] = await Promise.all([
        catalogService.listCategories(),
        catalogService.listProducts({ limit: 100 }),
      ]);
      setCategories(nextCategories);
      setProducts(nextProducts);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tải dữ liệu quản trị");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = categoryQuery.trim().toLocaleLowerCase();
    if (!query) return categories;
    return categories.filter((category) =>
      `${category.name} ${category.slug}`.toLocaleLowerCase().includes(query),
    );
  }, [categories, categoryQuery]);

  const filteredProducts = useMemo(() => {
    const query = productQuery.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        productCategory === "all" ||
        product.categoryId === productCategory ||
        product.category === productCategory;
      const matchesQuery =
        !query ||
        `${product.name} ${product.productCode} ${product.categoryName ?? product.category}`
          .toLocaleLowerCase()
          .includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [products, productCategory, productQuery]);

  const categoryProductCount = (category: Category) =>
    products.filter(
      (product) => product.categoryId === category.id || product.category === category.slug,
    ).length;

  const saveCategory = async (data: Partial<BackendCategory>) => {
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, data);
        toast.success("Đã cập nhật danh mục");
      } else {
        await api.createCategory(data);
        toast.success("Đã thêm danh mục");
      }
      setEditingCategory(null);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu danh mục");
    }
  };

  const saveProduct = async (data: Partial<BackendProduct>) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, data);
        toast.success("Đã cập nhật sản phẩm");
      } else {
        await api.createProduct(data);
        toast.success("Đã thêm sản phẩm");
      }
      setEditingProduct(null);
      setIsProductFormOpen(false);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu sản phẩm");
    }
  };

  const deleteCategory = async (category: Category) => {
    if (!window.confirm(`Xóa danh mục "${category.name}"?`)) return;
    try {
      await api.deleteCategory(category.id);
      toast.success("Đã xóa danh mục");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa danh mục");
    }
  };

  const deleteProduct = async (product: Product) => {
    if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) return;
    try {
      await api.deleteProduct(product.id);
      toast.success("Đã xóa sản phẩm");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa sản phẩm");
    }
  };

  const logout = async () => {
    await api.logout();
    window.location.href = "/san-pham";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Quản trị cửa hàng</h1>
            <p className="text-sm text-slate-500">
              {products.length} sản phẩm · {categories.length} danh mục
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-lg border bg-white px-3 py-2 text-sm"
              onClick={() => void loadData()}
            >
              Làm mới
            </button>
            <button
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
              onClick={() => void logout()}
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <nav className="mb-5 flex gap-2">
          {(["products", "categories"] as Section[]).map((item) => (
            <button
              key={item}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                section === item ? "bg-rose-600 text-white" : "bg-white text-slate-600"
              }`}
              onClick={() => setSection(item)}
            >
              {item === "products" ? "Sản phẩm" : "Danh mục"}
            </button>
          ))}
        </nav>

        {section === "categories" ? (
          <CategorySection
            categories={filteredCategories}
            query={categoryQuery}
            loading={loading}
            count={categoryProductCount}
            onQuery={setCategoryQuery}
            onEdit={setEditingCategory}
            onDelete={(category) => void deleteCategory(category)}
            onCreate={() =>
              setEditingCategory({ id: "", name: "", slug: "", image: "", description: "" })
            }
          />
        ) : (
          <ProductSection
            products={filteredProducts}
            categories={categories}
            query={productQuery}
            category={productCategory}
            loading={loading}
            onQuery={setProductQuery}
            onCategory={setProductCategory}
            onEdit={(product) => {
              setEditingProduct(product);
              setIsProductFormOpen(true);
            }}
            onDelete={(product) => void deleteProduct(product)}
            onCreate={() => {
              setEditingProduct(null);
              setIsProductFormOpen(true);
            }}
          />
        )}
      </div>

      {editingCategory && (
        <CategoryForm
          category={editingCategory.id ? editingCategory : null}
          onClose={() => setEditingCategory(null)}
          onSave={(data) => void saveCategory(data)}
        />
      )}
      {isProductFormOpen && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setEditingProduct(null);
            setIsProductFormOpen(false);
          }}
          onSave={(data) => void saveProduct(data)}
        />
      )}
    </div>
  );
}

function CategorySection(props: {
  categories: Category[];
  query: string;
  loading: boolean;
  count: (category: Category) => number;
  onQuery: (value: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onCreate: () => void;
}) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <Toolbar query={props.query} onQuery={props.onQuery} placeholder="Tìm tên hoặc slug danh mục">
        <button
          className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white"
          onClick={props.onCreate}
        >
          Thêm danh mục
        </button>
      </Toolbar>
      <DataMessage loading={props.loading} empty={!props.categories.length} />
      {!!props.categories.length && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="p-3">Tên</th>
                <th>Slug</th>
                <th>Sản phẩm</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {props.categories.map((category) => (
                <tr className="border-b last:border-0" key={category.id}>
                  <td className="p-3 font-medium">{category.name}</td>
                  <td>{category.slug}</td>
                  <td>{props.count(category)}</td>
                  <td className="text-right">
                    <button className="mr-3 text-rose-600" onClick={() => props.onEdit(category)}>
                      Sửa
                    </button>
                    <button className="text-red-600" onClick={() => props.onDelete(category)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ProductSection(props: {
  products: Product[];
  categories: Category[];
  query: string;
  category: string;
  loading: boolean;
  onQuery: (value: string) => void;
  onCategory: (value: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onCreate: () => void;
}) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <Toolbar
        query={props.query}
        onQuery={props.onQuery}
        placeholder="Tìm tên, mã hoặc danh mục sản phẩm"
      >
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={props.category}
          onChange={(event) => props.onCategory(event.target.value)}
        >
          <option value="all">Tất cả danh mục</option>
          {props.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white"
          onClick={props.onCreate}
        >
          Thêm sản phẩm
        </button>
      </Toolbar>
      <DataMessage loading={props.loading} empty={!props.products.length} />
      {!!props.products.length && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="p-3">Sản phẩm</th>
                <th>Mã</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {props.products.map((product) => (
                <tr className="border-b last:border-0" key={product.id}>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td>{product.productCode}</td>
                  <td>{product.categoryName || product.category || "Chưa phân loại"}</td>
                  <td>{product.price?.toLocaleString("vi-VN") ?? "-"} đ</td>
                  <td>{product.stockQuantity ?? 0}</td>
                  <td className="text-right">
                    <button className="mr-3 text-rose-600" onClick={() => props.onEdit(product)}>
                      Sửa
                    </button>
                    <button className="text-red-600" onClick={() => props.onDelete(product)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Toolbar(props: {
  query: string;
  onQuery: (value: string) => void;
  placeholder: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <input
        className="min-w-[240px] flex-1 rounded-lg border px-3 py-2 text-sm"
        value={props.query}
        onChange={(event) => props.onQuery(event.target.value)}
        placeholder={props.placeholder}
      />
      {props.children}
    </div>
  );
}

function DataMessage({ loading, empty }: { loading: boolean; empty: boolean }) {
  if (loading)
    return <p className="py-10 text-center text-sm text-slate-500">Đang tải dữ liệu...</p>;
  if (empty)
    return <p className="py-10 text-center text-sm text-slate-500">Không có dữ liệu phù hợp.</p>;
  return null;
}

function CategoryForm(props: {
  category: Category | null;
  onClose: () => void;
  onSave: (data: Partial<BackendCategory>) => void;
}) {
  const [name, setName] = useState(props.category?.name ?? "");
  const [slug, setSlug] = useState(props.category?.slug ?? "");
  const [description, setDescription] = useState(props.category?.description ?? "");
  return (
    <Modal title={props.category ? "Sửa danh mục" : "Thêm danh mục"} onClose={props.onClose}>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          props.onSave({
            categoryName: name.trim(),
            slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
            description,
            isActive: true,
          });
        }}
      >
        <input
          required
          className="w-full rounded border p-2"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Tên danh mục"
        />
        <input
          className="w-full rounded border p-2"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="Slug"
        />
        <textarea
          className="w-full rounded border p-2"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Mô tả"
        />
        <SubmitButtons onClose={props.onClose} />
      </form>
    </Modal>
  );
}

function ProductForm(props: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: Partial<BackendProduct>) => void;
}) {
  const [name, setName] = useState(props.product?.name ?? "");
  const [categoryId, setCategoryId] = useState(
    props.product?.categoryId || props.categories[0]?.id || "",
  );
  const [price, setPrice] = useState(String(props.product?.price ?? ""));
  const [stock, setStock] = useState(String(props.product?.stockQuantity ?? 0));
  const [color, setColor] = useState(props.product?.colors.join(", ") ?? "");
  return (
    <Modal title={props.product ? "Sửa sản phẩm" : "Thêm sản phẩm"} onClose={props.onClose}>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          props.onSave({
            productName: name.trim(),
            categoryId,
            price: Number(price),
            stockQuantity: Number(stock),
            color,
          });
        }}
      >
        <input
          required
          className="w-full rounded border p-2"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Tên sản phẩm"
        />
        <select
          className="w-full rounded border p-2"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          {props.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="w-full rounded border p-2"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Giá"
        />
        <input
          type="number"
          className="w-full rounded border p-2"
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          placeholder="Tồn kho"
        />
        <input
          className="w-full rounded border p-2"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          placeholder="Màu sắc"
        />
        <SubmitButtons onClose={props.onClose} />
      </form>
    </Modal>
  );
}

function Modal(props: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5">
        <div className="mb-4 flex justify-between">
          <h2 className="font-semibold">{props.title}</h2>
          <button onClick={props.onClose}>×</button>
        </div>
        {props.children}
      </div>
    </div>
  );
}

function SubmitButtons({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-end gap-2">
      <button type="button" className="rounded border px-3 py-2" onClick={onClose}>
        Hủy
      </button>
      <button className="rounded bg-rose-600 px-3 py-2 text-white" type="submit">
        Lưu
      </button>
    </div>
  );
}
