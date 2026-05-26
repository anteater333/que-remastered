import { defineConfig, loadEnv } from "vite";
import path from "path";
import fs from "fs";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react-swc";
import QRCode from "qrcode";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      svgr(),
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
      {
        name: "local-video-server",
        configureServer(server) {
          server.middlewares.use("/media", (req, res, next) => {
            // req.url 예: /videoId 또는 /videoId/index.m3u8 등
            const filePath = path.join(
              env.VITE_DEV_VIDEO_BASE_PATH,
              req.url ?? "",
            );

            if (!fs.existsSync(filePath)) {
              return next();
            }

            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Not ready yet" }));
              return;
            }

            // MIME 타입 설정
            const ext = path.extname(filePath);
            const mimeTypes: Record<string, string> = {
              ".m3u8": "application/vnd.apple.mpegurl",
              ".ts": "video/mp2t",
              ".mp4": "video/mp4",
              ".webm": "video/webm",
              ".m4s": "video/iso.segment",
              ".mpd": "application/dash+xml",
            };
            const contentType = mimeTypes[ext] ?? "application/octet-stream";

            res.setHeader("Content-Type", contentType);
            res.setHeader("Access-Control-Allow-Origin", "*"); // CORS 허용
            res.setHeader("Accept-Ranges", "bytes"); // Range request 지원

            // Range request 처리 (HLS/DASH 스트리밍에 중요)
            const range = req.headers["range"];
            if (range) {
              const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
              const start = parseInt(startStr, 10);
              const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
              const chunkSize = end - start + 1;

              res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${stat.size}`,
                "Content-Length": chunkSize,
              });
              fs.createReadStream(filePath, { start, end }).pipe(res);
            } else {
              res.setHeader("Content-Length", stat.size);
              res.writeHead(200);
              fs.createReadStream(filePath).pipe(res);
            }
          });
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
      // 로컬 개발용 프록시 설정
      proxy: {
        "/api": {
          target: env.VITE_API_SERVER_ADDR_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          secure: false,
          ws: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@shared": path.resolve(__dirname, "shared"),
      },
    },

    build: {
      outDir: "dist",
    },
  };
});
