import { defineConfig } from "@lovable.dev/vite-tanstack-config";
export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  nitro: { preset: "node-server" },
  vite: {
    server: {
      proxy: {
        "/api": { target: "http://103.147.122.13:5000", changeOrigin: true, secure: false },
      },
    },
  },
});
