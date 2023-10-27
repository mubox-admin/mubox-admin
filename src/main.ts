import App from "./App.vue";
import "ant-design-vue/dist/reset.css";
import router from "./router";
import { getServerConfig } from "./config";
import 'virtual:uno.css'

const app = createApp(App);

getServerConfig(app).then(async () => {
  app.use(router);
  await router.isReady();
  app.mount("#app");
});
