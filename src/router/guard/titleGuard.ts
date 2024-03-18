import router from "..";
import { useSettingStore } from "@/store/setting";

export function createTitleGuard() {
  router.beforeEach((to: ToRouteType) => {
    to.matched.forEach((item) => {
      if (!item.meta.title) return "";
      const { projectSetting } = useSettingStore();
      if (projectSetting.value.title)
        document.title = `${item.meta.title} | ${projectSetting.value.title}`;
      else document.title = item.meta.title;
    });
  });
}
