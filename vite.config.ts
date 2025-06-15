import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import QRCode from "qrcode";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      {
        name: "print-wsl-host-ip",
        async configureServer() {
          if (env.VITE_WSL_HOST_IP) {
            const URL = `http://${env.VITE_WSL_HOST_IP}:5173`;
            const QR = await QRCode.toString(URL);

            setTimeout(() => {
              console.log("🥕=============================================🥕");
              console.log("  HAPPY😭 HACKING W/ WSL !!");
              console.log(`  WSL Host: ${URL}`);
              console.log(`    ${QR.trim()}`);
            }, 500);
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
