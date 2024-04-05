import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { dependencies } from "./package.json";
function renderChunks(deps: Record<string, string>) {
  let chunks: any = {};
  Object.keys(deps).forEach((key) => {
    if (
      ["react", "react-router-dom", "react-dom"].filter((i) => i == key).length
    )
      return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "portfolio-v4",
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-router-dom", "react-dom"],
          ...renderChunks(dependencies),
        },
      },
    },
  },
});
