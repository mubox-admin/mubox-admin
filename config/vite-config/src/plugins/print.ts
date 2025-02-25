import type { PluginOption } from 'vite';

import type { PrintPluginOptions } from '../typing';
import { colors } from '@mubox/node-utils';

export function vitePrintPlugin(options: PrintPluginOptions = {}): PluginOption {
  const { infoMap = {} } = options;

  return {
    configureServer(server) {
      const _printUrls = server.printUrls;
      server.printUrls = () => {
        _printUrls();

        for (const [key, value] of Object.entries(infoMap)) {
          // eslint-disable-next-line no-console
          console.log(
            `  ${colors.green('➜')}  ${colors.bold(key)}: ${colors.cyan(value)}`,
          );
        }
      };
    },
    enforce: 'pre',
    name: 'vite:print-info',
  };
}
