// eslint.config.js
import antfu from "@antfu/eslint-config";

export default antfu({
  javascript: {
    overrides: {
      "no-restricted-syntax": [
        "error",
        "DebuggerStatement",
        "LabeledStatement",
        "WithStatement",
        "TSExportAssignment",
      ],
    },
  },
  stylistic: {
    quotes: "double",
    semi: true,
  },
  formatters: {
    css: true,
    markdown: "prettier",
  },
});
