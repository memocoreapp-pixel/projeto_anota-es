import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
// Em produção o app é publicado como "project page" do GitHub Pages, servido
// sob /projeto_anota-es/. Em desenvolvimento usamos a raiz "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/projeto_anota-es/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
