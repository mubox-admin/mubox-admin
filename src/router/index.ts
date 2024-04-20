// import "@/utils/sso";
import { createRouter } from "vue-router";
import type { RouteRecordRaw, Router } from "vue-router";
import remainingRouter from "./routes/remaining";
import {
  ascending,
  buildHierarchyTree,
  formatFlatteningRoutes,
  formatTwoStageRoutes,
  getHistoryMode,
} from "./utils";
import { createTitleGuard } from "./guard/titleGuard";
import { createPermissionGuard } from "./guard/permissionGuard";
import NProgress from "@/utils/progress";
import { usePermissionStore } from "@/store/permission";

const modules: Record<string, any> = import.meta.glob(
  ["./routes/**/*.ts", "!./routes/**/remaining.ts"],
  {
    eager: true,
  },
);

/** 原始静态路由（未做任何处理） */
const routes: RouteRecordRaw[] = [];
/**
 * 相当于把modules下的每一个export的对象加入到一个数组中，与i18n的那个处理方式类似
 */
Object.keys(modules).forEach((key) => {
  routes.push(modules[key].default);
});

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
/**
 * 这里做了4层处理
 * 第一层是将路由按rank进行排序
 * 第二层是将路由数组按树的思想进行标记   [x]这一步暂时不知道有什么用
 * 第三层是将路由拍平成一维数组，但是仍保留了原来嵌套的路由数组
 * 第四层是将首页提取成拍平路由的父级，变成二维数组，貌似是为了处理keep-alive问题
 */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Number.POSITIVE_INFINITY)))),
);

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteRecordRaw> = ascending(
  routes.flat(Number.POSITIVE_INFINITY),
).concat(...remainingRouter);

/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map((v) => {
  return remainingRouter[v].path;
});

/** 创建路由实例 */
export const router: Router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
  routes: constantRoutes.concat(...remainingRouter),
  strict: true,
  scrollBehavior(_, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        return savedPosition;
      }
      else {
        if (from.meta.saveSrollTop) {
          const top: number = document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  },
});

/** 重置路由 */
// 这里只重置后端传来的动态路由
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name, meta } = route;
    if (name && router.hasRoute(name) && meta?.backstage) {
      router.removeRoute(name);
      // [x]这里为什么不写在外面，将动态路由完全移除后再处理一次就好了
      router.options.routes = formatTwoStageRoutes(
        formatFlatteningRoutes(
          buildHierarchyTree(ascending(routes.flat(Number.POSITIVE_INFINITY))),
        ),
      );
    }
  });
  usePermissionStore().clearAllCachePage();
}

// 创建路由前置守卫
export function createRouterGuard() {
  NProgress.start();
  createTitleGuard();
  createPermissionGuard();
}

// 路由后置守卫
router.afterEach(() => {
  NProgress.done();
});

export default router;
