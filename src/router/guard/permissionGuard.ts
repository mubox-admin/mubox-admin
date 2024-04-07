import { isAllEmpty, isString } from "@mubox/utils";
import router from "..";
import { findRouteByPath, getTopMenu, initRouter, isOneOfArray } from "../utils";
import { BASIC_ROUTE, WHITE_LIST } from "../enums";
import { useTabsStore } from "@/store/tabs";
import { useMenuStore } from "@/store/menu";
import { useUserStore } from "@/store/user";
import { usePermissionStore } from "@/store/permission";
import { useSettingStore } from "@/store/setting";

const { VITE_HIDE_HOME } = import.meta.env;
/** 路由白名单 */
const whiteList: string[] = Object.values(WHITE_LIST);

export function createPermissionGuard() {
  const { userInfo, roles } = useUserStore();
  /** 如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面 */
  router.beforeEach((to: ToRouteType, _from, next) => {
    const toCorrectRoute = () => {
      whiteList.includes(to.fullPath) ? next(_from.fullPath) : next();
    };
    if (userInfo.value) {
      // 无权限跳转403页面
      if (to.meta?.roles && !isOneOfArray(to.meta?.roles, roles.value))
        next({ name: BASIC_ROUTE.ERROR403 });

      // 开启隐藏首页后在浏览器地址栏手动输入首页welcome路由则跳转到404页面
      if (VITE_HIDE_HOME === "true" && to.name === BASIC_ROUTE.WELCOME)
        next({ name: BASIC_ROUTE.ERROR404 });

      if (_from?.name) {
        // name为超链接
        toCorrectRoute();
        // 定位菜单和标签
        if (to.name && isString(to.name)) {
          useMenuStore().menuPositioning(to.name);
          const { currentTab, addTab } = useTabsStore();
          currentTab.value = to.name;
          addTab(to.name);
        }
      }
      else {
        // 刷新
        if (usePermissionStore().wholeMenus.value.length === 0 && to.name !== BASIC_ROUTE.LOGIN) {
          initRouter().then((router) => {
            const { projectSetting } = useSettingStore();
            if (!projectSetting.value.tabsSetting.cache) {
              const { path } = to;
              const route = findRouteByPath(path, router.options.routes[0].children);
              getTopMenu(true);
              // query、params模式路由传参数的标签页不在此处处理
              if (route && route.meta?.title) {
                if (isAllEmpty(route.parentId) && route.meta?.backstage) {
                  // 此处为动态顶级路由（目录）
                  if (route.children) {
                    const { path, name, meta } = route.children[0];
                    useTabsStore().pushTabs({
                      path,
                      name,
                      meta,
                    });
                  }
                }
                else {
                  const { path, name, meta } = route;
                  useTabsStore().pushTabs({
                    path,
                    name,
                    meta,
                  });
                }
              }
            }
            // 确保动态路由完全加入路由列表并且不影响静态路由（注意：动态路由刷新时router.beforeEach可能会触发两次，第一次触发动态路由还未完全添加，第二次动态路由才完全添加到路由列表，如果需要在router.beforeEach做一些判断可以在to.name存在的条件下去判断，这样就只会触发一次）
            if (isAllEmpty(to.name))
              router.push(to.fullPath);
          });
        }
        toCorrectRoute();
      }
    }
    else {
      if (to.name !== BASIC_ROUTE.LOGIN) {
        if (whiteList.includes(to.path))
          next();
        else
          next({ name: BASIC_ROUTE.LOGIN });
      }
      else {
        next();
      }
    }
  });
}
