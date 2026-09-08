import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Key, Lock, LogIn, Loader2, User } from "lucide-react";
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

  // Nếu đã đăng nhập trước đó thì tự động chuyển sang trang admin
  useEffect(() => {
    if (api.isAuthenticated()) {
      router.navigate({ to: "/admin" });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Vui lòng nhập tên đăng nhập!");
      return;
    }
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu!");
      return;
    }
    if (!secretKey.trim()) {
      toast.error("Vui lòng nhập Secret Key!");
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
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100/60 px-4 py-8 font-sans text-slate-800 antialiased">
      <div className="w-full max-w-[400px] rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-lg shadow-slate-200/40 transition-all">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-md">
            <span className="font-serif text-2xl font-bold">R</span>
          </div>
          <h1 className="mt-3 text-lg font-bold tracking-wider text-slate-900 uppercase">
            THỊNH PHÁT
          </h1>
          <p className="text-xs font-medium text-slate-500">Cổng Quản Trị Nội Bộ</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Tên đăng nhập</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-60"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Mật khẩu</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Secret Key */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Mã bảo mật (Secret Key) <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Key className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type={showSecretKey ? "text" : "password"}
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Secret Key"
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
                {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Đăng nhập</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-slate-400">
          © Thịnh Phát — Hệ thống quản trị nội bộ
        </div>
      </div>
    </div>
  );
}
