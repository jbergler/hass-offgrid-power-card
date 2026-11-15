import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: "src/offgrid-power-card.ts",
      formats: ["es"],
      fileName: () => "offgrid-power-card.js",
    },
    rollupOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
  test: {
    environment: "node",
  },
});
