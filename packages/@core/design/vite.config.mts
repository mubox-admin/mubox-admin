import { defineConfig } from '@mubox/vite-config';

export default defineConfig(async () => {
  return {
    vite: {
      publicDir: 'src/scss-bem',
    },
  };
});
