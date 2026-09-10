import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";

function MenuItem({
  to,
  icon,
  children,
}: {
  to: "/admin" | "/admin/products" | "/admin/categories";
  icon: string;
  children: React.ReactNode;
}) {
  const location = useLocation();

  const active =
    to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-slate-100 text-slate-900"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className="w-5 text-center">{icon}</span>

      <span>{children}</span>
    </Link>
  );
}

export function AdminShell() {
  const navigate = useNavigate();

  function handleLogout() {
    const keys = ["token", "accessToken", "access_token", "jwt", "authToken"];

    keys.forEach((key) => {
      localStorage.removeItem(key);
    });

    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");

    navigate({
      to: "/login",
    });
  }

  return (
    <div className="flex min-h-screen bg-[#f7f8fc] text-slate-900">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-[220px] flex-col border-r border-slate-200 bg-white">
        {/* LOGO */}
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            TP
          </div>

          <div>
            <div className="text-sm font-bold tracking-wide">THỊNH PHÁT</div>

            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Kẹp tóc & phụ kiện
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="px-3 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quản lý kho & hàng
          </p>

          <nav className="space-y-1">
            <MenuItem to="/admin" icon="▦">
              Dashboard
            </MenuItem>

            <MenuItem to="/admin/products" icon="◇">
              Sản phẩm
            </MenuItem>

            <MenuItem to="/admin/categories" icon="⊞">
              Danh mục
            </MenuItem>
          </nav>
        </div>

        {/* USER */}
        <div className="mt-auto border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold">
              A
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">Admin</div>

              <div className="text-xs text-slate-400">Administrator</div>
            </div>

            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              ↪
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        {/* TOPBAR */}
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-8 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Trang chủ</span>
            <span>/</span>

            <span className="font-medium text-slate-800">Quản trị hệ thống</span>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden w-64 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
              <span className="mr-2 text-slate-400">⌕</span>

              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Tìm kiếm SKU, tên kẹp tóc..."
              />
            </div>

            <button className="relative text-xl text-slate-500">
              ♧
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold">
                A
              </div>

              <span className="hidden text-sm font-semibold md:block">Admin</span>
            </div>

            <button
              onClick={handleLogout}
              className="text-lg text-slate-500 hover:text-slate-900"
              title="Đăng xuất"
            >
              ↪
            </button>
          </div>
        </header>

        {/* PAGE */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
