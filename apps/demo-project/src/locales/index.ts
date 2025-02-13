import type { LocaleSetupOptions, SupportedLanguagesType } from '@mubox/locales';
import type { App } from 'vue';

import {
  $t,
  setupI18n as coreSetup,
  loadLocalesMapFromDir,
} from '@mubox/locales';
import { preferences } from '@mubox/preferences';

const modules = import.meta.glob('./lang/**/*.json');

const localesMap = loadLocalesMapFromDir(
  /\.\/lang\/([^/]+)\/(.*)\.json$/,
  modules,
);

/**
 * 加载应用特有的语言包
 * 这里也可以改造为从服务端获取翻译数据
 * @param lang
 */
async function loadMessages(lang: SupportedLanguagesType) {
  const appLocaleMessages = await localesMap[lang]?.();
  return appLocaleMessages?.default;
}

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  await coreSetup(app, {
    defaultLocale: preferences.app.locale,
    loadMessages,
    missingWarn: !import.meta.env.PROD,
    ...options,
  });
}

export { $t, setupI18n };
