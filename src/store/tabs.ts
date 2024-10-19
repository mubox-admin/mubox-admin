import { isEqual, isString, isUrl, storageLocal } from "@mubox/utils";
import type { RouteRecordRaw } from "vue-router";
import { useSettingStore } from "./setting";
import router from "@/router";
import { TABS_KEY } from "@/enums/CacheEnum";

export interface Tab {
  name: RouteRecordRaw["name"];
  path: RouteRecordRaw["path"];
  meta?: RouteRecordRaw["meta"];
  query?: any;
  params?: any;
}

const { VITE_HIDE_HOME } = import.meta.env;
// 常驻路由,关闭 multitabsCache时使用
export const initRoutes: Tab[]
  = VITE_HIDE_HOME === "false"
    ? [
        // {
        //   name: "Welcome",
        //   path: "/welcome",
        //   meta: {
        //     // MU-TODO i18n
        //     title: "首页",
        //     icon: "homeFilled",
        //   },
        // },
      ]
    : [];

export const useTabsStore = createGlobalState(() => {
  // 当前Tab
  const currentTab = ref<string>();
  // Tab列表
  const tabList = ref(storageLocal.getItem<Tab[]>(TABS_KEY) || [...initRoutes]);
  // 缓存页面keepAlive
  const cachePageList = computed(() => {
    return tabList.value.filter(tab => tab.meta?.keepAlive).map(tab => tab.name as string);
  });
  // 点击菜单项时或者点击搜索登情况，添加tab标签
  function addTab(routeName: string): void {
    const hasValue = tabList.value.some((item) => {
      return item.path === routeName;
    });
    function concatRoute(route: readonly RouteRecordRaw[], value: string) {
      if (!hasValue) {
        route.forEach((routeItem) => {
          if (routeItem.name === value) {
            pushTabs({
              path: routeItem.path,
              name: routeItem.name,
              meta: routeItem.meta,
            });
          }
          else {
            if (routeItem.children && routeItem.children.length > 0)
              concatRoute(routeItem.children, value);
          }
        });
      }
    }
    concatRoute(router.options.routes, routeName);
  }

  function equalTabs(tabs: Tab[]) {
    tabList.value = tabs;
    tabsCache(tabList.value);
  }
  function pushTabs(tab: Tab) {
    // 不添加到标签页
    if (tab?.meta?.hiddenTab)
      return;
    // 如果是外链无需添加信息到标签页
    if (isString(tab?.name) && isUrl(tab?.name))
      return;
    // 如果title为空拒绝添加空信息到标签页
    if (tab?.meta?.title.length === 0)
      return;

    // 判断tab是否已存在
    const tabHasExits = tabList.value.some((item) => {
      return item.path === tab.path;
    });
    // 判断tab中的query键值是否相等
    const tabQueryHasExits = tabList.value.some((item) => {
      return isEqual(item?.query, tab?.query);
    });
    // 判断tab中的params键值是否相等
    const tabParamsHasExits = tabList.value.some((item) => {
      return isEqual(item?.params, tab?.params);
    });
    if (tabHasExits && tabQueryHasExits && tabParamsHasExits)
      return;

    // 动态路由可打开的最大数量
    const dynamicLevel = tab?.meta?.dynamicLevel ?? -1;
    if (dynamicLevel > 0) {
      if (tabList.value.filter(e => e?.path === tab.path).length >= dynamicLevel) {
        // 如果当前已打开的动态路由数大于dynamicLevel，替换第一个动态路由标签
        const index = tabList.value.findIndex(item => item?.path === tab.path);
        if (index !== -1)
          tabList.value.splice(index, 1);
      }
    }
    tabList.value.push(tab);
    tabsCache(tabList.value);
  }
  function spliceTabs(
    // tab路径
    routeName: string,
    position?: { startIndex: number; length?: number },
  ) {
    if (!routeName)
      throw new Error("当前路由未添加name，请添加name后重试");
    if (!position) {
      const index = tabList.value.findIndex(v => v.name === routeName);

      if (index === -1)
        return;
      tabList.value.splice(index, 1);
    }
    else {
      tabList.value.splice(position?.startIndex, position?.length);
    }
    tabsCache(tabList.value);
    return tabList.value;
  }

  function TabsListCacheChange(cache: boolean) {
    const { projectSetting } = useSettingStore();
    projectSetting.value.tabsSetting.cache = cache;
    if (projectSetting.value.tabsSetting.cache)
      storageLocal.setItem(TABS_KEY, tabList.value);
    else
      storageLocal.removeItem(TABS_KEY);
  }
  function tabsCache(tabs: Tab[]) {
    const { projectSetting } = useSettingStore();
    if (projectSetting.value.tabsSetting.cache)
      storageLocal.setItem(TABS_KEY, tabs);
  }
  return {
    currentTab,
    tabList,
    cachePageList,
    TabsListCacheChange,
    tabsCache,
    addTab,
    equalTabs,
    pushTabs,
    spliceTabs,
  };
});
