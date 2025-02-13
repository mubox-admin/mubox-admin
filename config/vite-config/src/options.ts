import type { Options as PwaPluginOptions } from 'vite-plugin-pwa';

import type { ImportmapPluginOptions } from './typing';

const isDevelopment = process.env.NODE_ENV === 'development';

function getDefaultPwaOptions(name: string): Partial<PwaPluginOptions> {
  return {
    manifest: {
      description:
      'Mubox Admin is a modern admin dashboard template based on Vue 3. ',
      icons: [
        {
          sizes: '192x192',
          src: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/pwa-icon-192.png',
          type: 'image/png',
        },
        {
          sizes: '512x512',
          src: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/pwa-icon-512.png',
          type: 'image/png',
        },
      ],
      name: `${name}${isDevelopment ? ' dev' : ''}`,
      short_name: `${name}${isDevelopment ? ' dev' : ''}`,
    },
  };
}

/**
 * importMap CDN 暂时不开启，因为有些包不支持，且网络不稳定
 */
const defaultImportMapOptions: ImportmapPluginOptions = {
  // 通过 Importmap CDN 方式引入,
  // 目前只有esm.sh源兼容性好一点，jspm.io对于 esm 入口要求高
  defaultProvider: 'esm.sh',
  importMap: [
    { name: 'vue' },
    { name: 'pinia' },
    { name: 'vue-router' },
    // { name: 'vue-i18n' },
    { name: 'dayjs' },
    { name: 'vue-demi' },
  ],
};

export { defaultImportMapOptions, getDefaultPwaOptions };
