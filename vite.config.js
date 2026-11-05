import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const { VITE_API_BASE_URL: apiBaseUrl = "https://api-games.nunbun.sbs" } =
    loadEnv(mode, process.cwd(), "");

  return {
    server: {
      proxy: {
        "/api": {
          target: apiBaseUrl,
          changeOrigin: true
        }
      }
    }
  };
});
