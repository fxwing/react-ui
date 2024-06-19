import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    AutoImport({ imports: ["react"], dirs: ["./src/components/**"] }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: false,
    rollupOptions: {
      external: ["dayjs"],
    },
  },
});
