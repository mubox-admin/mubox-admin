import router from "..";
import { handleAliveRoute } from "../utils";

export function createCacheGuard() {
  router.beforeEach((to: ToRouteType, _from) => {
    if (to.meta?.keepAlive) {
      handleAliveRoute(to, "add");
      // 页面整体刷新和点击标签页刷新
      if (_from.name === undefined || _from.name === "Redirect") {
        handleAliveRoute(to);
      }
    }
  });
}
