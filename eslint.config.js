// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu({
  rules: {
    'node/prefer-global/process': 'off',
    'no-console': 'warn',
    '@typescript-eslint/no-unsafe-function-type': 'off',
  },
  stylistic: {
    quotes: 'single',
    semi: true,
  },
  formatters: {
    css: true,
    markdown: 'prettier',
  },
});
