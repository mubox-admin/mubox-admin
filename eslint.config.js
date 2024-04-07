// eslint.config.js
import antfu from "@antfu/eslint-config";

export default antfu({
  stylistic: {
    quotes: "double",
    semi: true,
  },
  formatters: {
    css: true,
    markdown: "prettier",
  },
});
