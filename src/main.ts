import { MotionPlugin } from "@vueuse/motion";
import * as Icons from "@ant-design/icons-vue";
import App from "./App.vue";
import "ant-design-vue/dist/reset.css";
import router from "./router";
import { getServerConfig } from "./config";
import "virtual:uno.css";
const app = createApp(App);

getServerConfig(app).then(async () => {
  app.use(router);
  app.use(MotionPlugin);
  // 动态注册所有Ant Icon 为了菜单动态载入
  for (const icon in Icons) {
    app.component(icon, Icons[icon]);
  }
  await router.isReady();
  app.mount("#app");
});
