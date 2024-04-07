import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  format: ["cjs", "esm", "iife"],
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  dts: true,
});
