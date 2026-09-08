import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "@/services/api";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (!api.isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminPage,
});

function AdminPage() {
  const user = api.getCurrentUser();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Trang quản trị</h1>
      {user && (
        <p className="mt-2 text-sm text-slate-600">
          Xin chào, <strong>{String(user.username ?? "")}</strong>
          {user.role ? ` (${String(user.role)})` : ""}
        </p>
      )}
    </div>
  );
}
