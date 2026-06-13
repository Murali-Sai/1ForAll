import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Dev server proxies /api to the FastAPI backend (Phase 6) when it's running.
// Until then the typed client falls back to bundled mock data.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
