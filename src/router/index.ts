// import "@/utils/sso";
import { createRouter } from "vue-router";
import { isAllEmpty, isString, isUrl, openLink, storageSession } from "@mubox/utils";
import {
  ascending,
  buildHierarchyTree,
  findRouteByPath,
  formatFlatteningRoutes,
  formatTwoStageRoutes,
  getHistoryMode,
  getTopMenu,
  handleAliveRoute,
  initRouter,
  isOneOfArray,
} from "./utils";
import remainingRouter from "./routes/remaining";
import type { RouteRecordRaw, Router } from "vue-router";
import { getConfig } from "@/config";
import NProgress from "@/utils/progress";
import { type DataInfo, sessionKey } from "@/utils/auth";
import { useTagsStore } from "@/store/tags";
import { usePermissionStore } from "@/store/permission";
import { useMenuStore } from "@/store/menu";

const { VITE_HIDE_HOME } = import.meta.env;

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
      } else {
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

/** 路由白名单 */
const whiteList = ["/login"];

router.beforeEach((to: ToRouteType, _from, next) => {
  if (to.meta?.keepAlive) {
    handleAliveRoute(to, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "Redirect") {
      handleAliveRoute(to);
    }
  }
  const userInfo = storageSession.getItem<DataInfo<number>>(sessionKey);
  NProgress.start();
  const externalLink = isUrl(to?.name as string);
  if (!externalLink) {
    to.matched.forEach((item) => {
      if (!item.meta.title) return "";
      const Title = getConfig().Title;
      // MU-TODO i18n
      if (Title) document.title = `${item.meta.title} | ${Title}`;
      else document.title = item.meta.title;
    });
  }
  /** 如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面 */
  function toCorrectRoute() {
    whiteList.includes(to.fullPath) ? next(_from.fullPath) : next();
  }
  if (userInfo) {
    // 无权限跳转403页面
    if (to.meta?.roles && !isOneOfArray(to.meta?.roles, userInfo?.roles)) {
      next({ path: "/error/403" });
    }
    // 开启隐藏首页后在浏览器地址栏手动输入首页welcome路由则跳转到404页面
    if (VITE_HIDE_HOME === "true" && to.fullPath === "/welcome") {
      next({ path: "/error/404" });
    }
    if (_from?.name) {
      // name为超链接
      if (externalLink) {
        openLink(to?.name as string);
        NProgress.done();
      } else {
        toCorrectRoute();
        if (to.name && isString(to.name)) {
          useMenuStore().menuPositioning(to.name);
          const { currentTab, addTag } = useTagsStore();
          currentTab.value = to.name;
          addTag(to.name);
        }
      }
    } else {
      // 刷新
      if (usePermissionStore().wholeMenus.value.length === 0 && to.path !== "/login") {
        initRouter().then((router) => {
          if (!useTagsStore().tagListCache.value) {
            const { path } = to;
            const route = findRouteByPath(path, router.options.routes[0].children);
            getTopMenu(true);
            // query、params模式路由传参数的标签页不在此处处理
            if (route && route.meta?.title) {
              if (isAllEmpty(route.parentId) && route.meta?.backstage) {
                // 此处为动态顶级路由（目录）
                if (route.children) {
                  const { path, name, meta } = route.children[0];
                  useTagsStore().pushTags({
                    path,
                    name,
                    meta,
                  });
                }
              } else {
                const { path, name, meta } = route;
                useTagsStore().pushTags({
                  path,
                  name,
                  meta,
                });
              }
            }
          }
          // 确保动态路由完全加入路由列表并且不影响静态路由（注意：动态路由刷新时router.beforeEach可能会触发两次，第一次触发动态路由还未完全添加，第二次动态路由才完全添加到路由列表，如果需要在router.beforeEach做一些判断可以在to.name存在的条件下去判断，这样就只会触发一次）
          if (isAllEmpty(to.name)) router.push(to.fullPath);
        });
      }
      toCorrectRoute();
    }
  } else {
    if (to.path !== "/login") {
      if (whiteList.includes(to.path)) {
        next();
      } else {
        next({ path: "/login" });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
