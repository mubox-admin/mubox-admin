import type { RouteRecordRaw } from "vue-router";
import { constantMenus as constantMenus_ } from "@/router";
import { ascending, filterNoPermissionTree, filterTree } from "@/router/utils";

export const usePermissionStore = createGlobalState(() => {
  // 静态路由生成的菜单
  const constantMenus = ref(constantMenus_);
  // 整体路由生成的菜单（静态、动态）
  const wholeMenus = ref<RouteRecordRaw[]>([]);

  /** [√]组装整体路由生成的菜单（最终菜单） */
  function handleWholeMenus(routes: RouteRecordRaw[]) {
    wholeMenus.value = filterNoPermissionTree(
      filterTree(ascending(constantMenus.value.concat(routes))),
    );
  }
  /** 清空缓存页面 */
  function clearAllCachePage() {
    wholeMenus.value = [];
  }
  return {
    constantMenus,
    wholeMenus,
    handleWholeMenus,
    clearAllCachePage,
  };
});
