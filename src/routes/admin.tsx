import { createFileRoute, redirect } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") {
      return;
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("authToken");

    if (!token) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: AdminLayout,
});

function AdminLayout() {
  return <AdminShell />;
}
