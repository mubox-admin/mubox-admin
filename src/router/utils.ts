import { isProxy, toRaw } from "vue";
import { createWebHashHistory, createWebHistory } from "vue-router";
import {
  clone,
  intersection,
  isAllEmpty,
  isArray,
  isNumber,
  isString,
  storageSession,
} from "@mubox/utils";
import type { RouteRecord, RouteRecordRaw, Router, RouterHistory } from "vue-router";

import { BASIC_ROUTE } from "./enums";
import { router } from "./index";
import { useTabsStore } from "@/store/tabs";
import { usePermissionStore } from "@/store/permission";

// 动态路由
import { getAsyncRoutes } from "@/api/routes";
import { useUserStore } from "@/store/user";
import { useSettingStore } from "@/store/setting";
import { ASYNC_ROUTE_KEY } from "@/enums/CacheEnum";

const IFrame = () => import("@/layout/frameView.vue");
// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/**/*.{vue,tsx}");

/** 获取路由历史模式 https://next.router.vuejs.org/zh/guide/essentials/history-mode.html */
function getHistoryMode(routerHistory: string): RouterHistory {
  // len为1 代表只有历史模式 为2 代表历史模式中存在base参数 https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
  const historyMode = routerHistory.split(",");
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];
  // no param
  if (historyMode.length === 1) {
    if (leftMode === "hash")
      return createWebHashHistory("");
    else if (leftMode === "h5")
      return createWebHistory("");
  } // has param
  else if (historyMode.length === 2) {
    if (leftMode === "hash")
      return createWebHashHistory(rightMode);
    else if (leftMode === "h5")
      return createWebHistory(rightMode);
  }
  // 默认返回
  return createWebHashHistory(rightMode);
}

// #region 路由四层处理

/** 按照路由中meta下的rank等级升序来排序路由 */
function ascending(arr: RouteRecordRaw[]) {
  arr.forEach((v, index) => {
    // 当rank不存在时，根据顺序自动创建，首页路由永远在第一位
    if (v.meta && handRank(v))
      v.meta.rank = index + 2;
  });
  arr.sort((a, b) => {
    if (a.meta && b.meta && isNumber(a.meta.rank) && isNumber(b.meta.rank))
      return a.meta.rank - b.meta.rank;
    else return 0;
  });
  return arr;
}

/**
 * @description 创建层级关系
 * @param tree 树
 * @param pathList 每一项的id组成的数组
 * @returns 创建层级关系后的树
 */
/**
 *  [√]这个函数将传入的数组中的每一个路由元素节点添加id、parentId和pathList作为标记
 *  ！需要注意一点是这个函数会改变传入的原数组
 */
export function buildHierarchyTree(tree: RouteRecordRaw[], pathList: RouteRecordRaw["pathList"] = []): RouteRecordRaw[] {
  if (!Array.isArray(tree))
    return [];

  if (!tree || tree.length === 0)
    return [];
  for (const [key, node] of tree.entries()) {
    node.id = key;
    node.parentId = pathList.length ? pathList[pathList.length - 1] : null;
    node.pathList = [...pathList, node.id];
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren && node.children)
      buildHierarchyTree(node.children, node.pathList);
  }
  return tree;
}

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
function formatFlatteningRoutes(routesList: RouteRecordRaw[]): RouteRecordRaw[] {
  if (routesList.length === 0)
    return routesList;
  for (let i = 0; i < routesList.length; i++) {
    const children = routesList[i].children;
    if (isArray(children))
      routesList = routesList.slice(0, i + 1).concat(children, routesList.slice(i + 1));
  }
  return routesList;
}

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * https://github.com/pure-admin/vue-pure-admin/issues/67
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0)
    return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((v: RouteRecordRaw) => {
    if (v.path === "/") {
      newRoutesList.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: [],
      });
    }
    else {
      if (newRoutesList.length > 0 && newRoutesList[0]?.children)
        newRoutesList[0]?.children.push({ ...v });
    }
  });
  return newRoutesList;
}

// #endregion

// #region beforeEach 路由处理

/** 初始化路由（`new Promise` 写法防止在异步请求中造成无限循环） */
function initRouter(): Promise<Router> {
  if (useSettingStore().projectSetting.value.cachingAsyncRoutes) {
    // 开启动态路由缓存本地sessionStorage
    const asyncRouteList = storageSession.getItem(ASYNC_ROUTE_KEY) as RouteRecordRaw[];
    if (asyncRouteList && asyncRouteList?.length > 0) {
      return new Promise((resolve) => {
        handleAsyncRoutes(asyncRouteList);
        resolve(router);
      });
    }
    else {
      return new Promise((resolve) => {
        getAsyncRoutes().then((data) => {
          handleAsyncRoutes(clone(data));
          storageSession.setItem(ASYNC_ROUTE_KEY, data);
          resolve(router);
        });
      });
    }
  }
  else {
    return new Promise((resolve) => {
      getAsyncRoutes().then((data) => {
        handleAsyncRoutes(clone(data));
        resolve(router);
      });
    });
  }
}

/** 处理动态路由（后端返回的路由） */
function handleAsyncRoutes(routeList: RouteRecordRaw[]) {
  if (routeList.length === 0) {
    usePermissionStore().handleWholeMenus(routeList);
  }
  else {
    formatFlatteningRoutes(buildHierarchyTree(formatAsyncRoutes(routeList))).forEach((v) => {
      // 防止重复添加路由
      if (
        router.options.routes[0].children
        && !router.options.routes[0].children.find(value => value.path === v.path)
      ) {
        // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
        if (router.options.routes[0].children) {
          router.options.routes[0].children.push(v);
          // 最终路由进行升序
          ascending(router.options.routes[0].children);
        }
        if (v?.name && !router.hasRoute(v?.name))
          router.addRoute(v);
        const flattenRouters = router.getRoutes().find(n => n.path === "/");
        if (flattenRouters)
          router.addRoute(flattenRouters);
      }
    });
    usePermissionStore().handleWholeMenus(routeList);
  }
  addPathMatch();
}

/** 过滤后端传来的动态路由 重新生成规范路由 */
function formatAsyncRoutes(arrRoutes: Array<RouteRecordRaw>) {
  if (!arrRoutes || !arrRoutes.length)
    return [];
  const modulesRoutesKeys = Object.keys(modulesRoutes);
  arrRoutes.forEach((v: RouteRecordRaw) => {
    // 将backstage属性加入meta，标识此路由为后端返回路由
    if (v?.meta)
      v.meta.backstage = true;
    // 父级的redirect属性取值：如果子级存在且父级的redirect属性不存在，默认取第一个子级的path；如果子级存在且父级的redirect属性存在，取存在的redirect属性，会覆盖默认值
    if (v?.children && v.children.length && !v.redirect)
      v.redirect = v.children[0].path;
    // 父级的name属性取值：如果子级存在且父级的name属性不存在，默认取第一个子级的name；如果子级存在且父级的name属性存在，取存在的name属性，会覆盖默认值（注意：测试中发现父级的name不能和子级name重复，如果重复会造成重定向无效（跳转404），所以这里给父级的name起名的时候后面会自动加上`Parent`，避免重复）
    if (v?.children && v.children.length && !v.name)
      v.name = `${v.children[0].name as string}Parent`;
    if (v.meta?.frameSrc) {
      v.component = IFrame;
    }
    else {
      // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会跟path保持一致）
      // Tips：后台传入的路由component为文件路径，也就是string类型，这里做起类型处理比较麻烦，手动写一行这个注释便于理解
      const index = v?.component
        ? modulesRoutesKeys.findIndex(ev => ev.includes(v.component as any))
        : modulesRoutesKeys.findIndex(ev => ev.includes(v.path));
      v.component = modulesRoutes[modulesRoutesKeys[index]];
    }
    if (v?.children && v.children.length)
      formatAsyncRoutes(v.children);
  });
  return arrRoutes;
}

/** 查找对应 `path` 的路由信息 */
function findRouteByPath(
  path: string,
  routes: readonly RouteRecordRaw[] = [],
): RouteRecordRaw | null {
  let res = routes.find((item: { path: string }) => item.path === path) || null;
  if (res) {
    return isProxy(res) ? toRaw(res) : res;
  }
  else {
    for (const route of routes) {
      if (Array.isArray(route.children) && route.children.length > 0) {
        res = findRouteByPath(path, route.children);
        if (res)
          return isProxy(res) ? toRaw(res) : res;
      }
    }
    return null;
  }
}

/** 获取所有菜单中的第一个菜单（顶级菜单） */
function getTopMenu(tagPush = false) {
  const topMenu = usePermissionStore().wholeMenus.value[0]?.children?.[0] as RouteRecord;
  if (topMenu && tagPush)
    useTabsStore().pushTabs(topMenu);
  return topMenu;
}

// #endregion

/** 过滤meta中showLink为false的菜单 */
function filterTree(data: RouteRecordRaw[]) {
  const newTree = clone(data).filter(v => v.meta?.showLink !== false);
  newTree.forEach(v => v.children && (v.children = filterTree(v.children)));
  return newTree;
}

/** 过滤children长度为0的的目录，当目录下没有菜单时，会过滤此目录，目录没有赋予roles权限，当目录下只要有一个菜单有显示权限，那么此目录就会显示 */
function filterChildrenTree(data: RouteRecordRaw[]) {
  const newTree = clone(data).filter(v => v?.children?.length !== 0);
  newTree.forEach(v => v.children && (v.children = filterTree(v.children)));
  return newTree;
}

/** 从sessionStorage里取出当前登陆用户的角色roles，过滤无权限的菜单 */
function filterNoPermissionTree(data: RouteRecordRaw[]) {
  const { roles } = useUserStore();
  const newTree = clone(data).filter(v => isOneOfArray(v.meta?.roles, roles.value));
  newTree.forEach(v => v.children && (v.children = filterNoPermissionTree(v.children)));
  return filterChildrenTree(newTree);
}

/** 通过指定 `key` 获取父级路径集合，默认 `key` 为 `path` */
function getParentPaths(
  value: string,
  routes: readonly RouteRecordRaw[],
  key = "path",
  returnKey = "path",
) {
  // 深度遍历查找
  function dfs(routes: readonly RouteRecordRaw[], value: string, parents: string[]) {
    for (const item of routes) {
      // 返回父级path
      if (item[key] === value)
        return parents;
      // children不存在或为空则不递归
      if (!item.children || !item.children.length)
        continue;
      // 往下查找时将当前path入栈
      parents.push(item[returnKey]);

      if (dfs(item.children, value, parents).length)
        return parents;
      // 深度遍历查找未找到时当前path 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  }

  return dfs(routes, value, []);
}

/** 获取当前页面按钮级别的权限 */
function getAuths(): Array<string> {
  return router.currentRoute.value.meta.auths as Array<string>;
}

/** 是否有按钮级别的权限 */
function hasAuth(value: string | Array<string>): boolean {
  if (!value)
    return false;
  /** 从当前路由的`meta`字段里获取按钮级别的所有自定义`code`值 */
  const metaAuths = getAuths();
  if (!metaAuths)
    return false;
  const isAuths = isString(value)
    ? metaAuths.includes(value)
    : value.every(item => metaAuths.includes(item));
  return !!isAuths;
}

function addPathMatch() {
  if (!router.hasRoute("NotFound")) {
    router.addRoute({
      path: "/:pathMatch(.*)",
      name: "NotFound",
      redirect: "/error/404",
    });
  }
}

function handRank(routeInfo: any) {
  const { name, path, parentId, meta } = routeInfo;
  return isAllEmpty(parentId)
    ? !!(isAllEmpty(meta?.rank) || (meta?.rank === 0 && name !== BASIC_ROUTE.HOME && path !== "/"))
    : false;
}

/** 判断两个数组彼此是否存在相同值 */
function isOneOfArray(a: Array<string> | undefined, b: Array<string> | undefined) {
  return Array.isArray(a) && Array.isArray(b)
    ? intersection(a, b).length > 0
    : true;
}

export {
  hasAuth,
  getAuths,
  ascending,
  filterTree,
  initRouter,
  getTopMenu,
  addPathMatch,
  isOneOfArray,
  getHistoryMode,
  formatAsyncRoutes,
  getParentPaths,
  findRouteByPath,
  formatTwoStageRoutes,
  formatFlatteningRoutes,
  filterNoPermissionTree,
};
