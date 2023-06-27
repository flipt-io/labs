import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async () => {
  const mdx = await import("@mdx-js/rollup");
  return {
    publicDir: "public",
    build: {
      // Relative to the root
      outDir: "build",
    },
    plugins: [
      mdx.default({ remarkPlugins: [] }),
      react({
        include: ["src/**/*.{ts,tsx}"],
      }),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "src"),
      },
    },
  };
});
