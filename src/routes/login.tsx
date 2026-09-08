import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Key,
  Lock,
  LogIn,
  Loader2,
  Shield,
  ShieldAlert,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/services/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Đăng nhập Quản trị viên — Thịnh Phát" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Nếu đã đăng nhập trước đó thì tự động chuyển sang trang admin
  useEffect(() => {
    if (api.isAuthenticated()) {
      router.navigate({ to: "/admin" });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      toast.error("Vui lòng nhập tên đăng nhập!");
      return;
    }
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu!");
      return;
    }
    if (!secretKey.trim()) {
      toast.error("Vui lòng nhập mã bảo mật nội bộ (Secret Key)!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.login({
        username: username.trim(),
        password,
        secretKey: secretKey.trim(),
      });

      toast.success(res.message || "Đăng nhập quản trị viên thành công!");
      // Chuyển hướng sang trang quản trị admin
      router.navigate({ to: "/admin" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50/60 font-sans text-slate-800 antialiased selection:bg-slate-900 selection:text-white">
      {/* Top Header Bar */}
      <header className="flex w-full items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-slate-800 uppercase">
          <Shield className="h-4 w-4 text-slate-700" />
          <span>THỊNH PHÁT</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600">
          <Shield className="h-4 w-4 text-slate-500" />
          <span>CỔNG QUẢN TRỊ</span>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[460px] rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-xl shadow-slate-100/80">
          {/* Logo Brand Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-md">
                <span className="font-serif text-xl font-bold tracking-tight">R</span>
              </div>
              <div className="text-left">
                <h2 className="text-lg font-bold tracking-wider text-slate-900 uppercase">
                  THỊNH PHÁT
                </h2>
                <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                  KẸP TÓC &amp; PHỤ KIỆN
                </p>
              </div>
            </div>

            {/* Badge System */}
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-[11px] font-medium text-blue-700">
              <Lock className="h-3 w-3" />
              <span>HỆ THỐNG QUẢN TRỊ NỘI BỘ</span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Đăng nhập Quản trị viên
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Truy cập hệ thống quản lý danh mục và sản phẩm sỉ THỊNH PHÁT
            </p>
          </div>

          {/* Error Banner if any */}
          {errorMessage && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-700">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Tên đăng nhập (Username)
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên tài khoản quản trị (admin_thinhphat)"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-60"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Mật khẩu</label>
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      "Vui lòng liên hệ Trưởng bộ phận Kỹ thuật nội bộ để cấp lại mật khẩu."
                    )
                  }
                  className="text-xs text-slate-400 transition-colors hover:text-slate-600"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 transition-colors hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Secret Key Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Mã bảo mật nội bộ (Secret Key) <span className="text-red-500">*</span>
                </label>
                <span className="font-mono text-[11px] text-slate-400">2FA Token</span>
              </div>
              <div className="relative flex items-center">
                <Key className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type={showSecretKey ? "text" : "password"}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Ví dụ: TP-SEC-8899-XXXX"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 text-slate-400 transition-colors hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showSecretKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Mã định danh 2FA hoặc Secret Key được cấp riêng cho ban quản trị
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang xác thực bảo mật...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Đăng nhập hệ thống</span>
                </>
              )}
            </button>
          </form>

          {/* Security Disclaimer Box */}
          <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs leading-relaxed text-blue-900/80">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <p>
              Chỉ dành riêng cho nhân viên quản trị THỊNH PHÁT. Mọi hành vi truy cập trái
              phép đều được tự động lưu trữ địa chỉ IP và nhật ký kiểm toán.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400">
        <p>© 2024 CÔNG TY TNHH THỊNH PHÁT. Bảo lưu mọi quyền.</p>
      </footer>
    </div>
  );
}
