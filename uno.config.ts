import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    // presetIcons({
    //   extraProperties: {
    //     display: "inline-block",
    //     "vertical-align": "-0.125rem",
    //     "margin-right": "0.5rem",
    //     "font-size": "1rem",
    //   },
    // }),
  ],
  shortcuts: {
    "flex-box": "flex justify-center items-center",
    "menu-icon": "cursor-pointer px-6 text-lg leading-loose transition hover:text-blue",
  },
});
