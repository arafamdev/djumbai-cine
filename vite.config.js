import { cwd } from "node:process";

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), "");

  return {
    plugins: [react(), tailwindcss()],

    server: {
      proxy: {
        "/api/tmdb": {
          target: "https://api.themoviedb.org",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/tmdb/, "/3"),
          headers: {
            Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
          },
        },
      },
    },
  };
});
