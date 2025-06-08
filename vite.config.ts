import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      {
        name: "print-wsl-host-ip",
        configureServer() {
          if (env.VITE_WSL_HOST_IP) {
            console.log("🥕=============================================🥕");
            console.log("  HAPPY😭 HACKING W/ WSL !!");
            console.log(`  WSL Host: http://${env.VITE_WSL_HOST_IP}:5173`);
            console.log("🥕=============================================🥕");
          }
        },
      },
    ],
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
  };
});
