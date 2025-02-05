import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 5120,
  },
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint -c ./eslint.config.mjs "./src/**///*.{ts,tsx}"',
      },
    }),
  ],
});
