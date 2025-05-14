import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { version } from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  base: "/pntbiz-dev-utils/",
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
