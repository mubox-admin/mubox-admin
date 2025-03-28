import { $t, setupI18n } from '#/locales';

import { router } from '#/router';
import { registerAccessDirective } from '@mubox/access';
import { preferences } from '@mubox/preferences';
import { initStores } from '@mubox/stores';

import { useTitle } from '@vueuse/core';
import { createApp, watchEffect } from 'vue';

import { initComponentAdapter } from './adapter/components';
import App from './app.vue';

import '@mubox/styles';

async function bootstrap(namespace: string) {
  // 初始化组件适配器
  await initComponentAdapter();

  const app = createApp(App);

  // 国际化 i18n 配置
  await setupI18n(app);

  // 配置 pinia-tore
  await initStores(app, { namespace });

  // 安装权限指令
  registerAccessDirective(app);

  // 配置路由及路由守卫
  app.use(router);

  // 动态更新标题
  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      const routeTitle = router.currentRoute.value.meta?.title;
      const pageTitle
        = (routeTitle ? `${$t(routeTitle)} - ` : '') + preferences.app.name;
      useTitle(pageTitle);
    }
  });

  app.mount('#app');
}

export { bootstrap };
