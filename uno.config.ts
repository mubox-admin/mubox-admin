import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno()],
  shortcuts: { "flex-box": "flex justify-center items-center" },
});
