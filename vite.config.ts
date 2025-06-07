import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use '@/styles/common' as *;
        `,
      },
    },
  },
  server: {
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
