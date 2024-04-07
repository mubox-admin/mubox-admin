import { MotionPlugin } from "@vueuse/motion";
import * as Icons from "@ant-design/icons-vue";
import App from "./App.vue";
import "ant-design-vue/dist/reset.css";
import router, { createRouterGuard } from "./router";
import "virtual:uno.css";
import { i18n } from "./locales";

const app = createApp(App);

app.use(MotionPlugin);
app.use(i18n);
app.use(router);
createRouterGuard();
// 动态注册所有Ant Icon 为了菜单动态载入
for (const icon in Icons)
  app.component(icon, Icons[icon]);

await router.isReady();
app.mount("#app");
