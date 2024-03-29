import { debounce } from "@mubox/utils";
import { useTabsStore } from "./tabs";
import type { RouteRecordName } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { constantMenus as constantMenus_ } from "@/router";
import { ascending, filterNoPermissionTree, filterTree } from "@/router/utils";

export const usePermissionStore = createGlobalState(() => {
  // 静态路由生成的菜单
  const constantMenus = ref(constantMenus_);
  // 整体路由生成的菜单（静态、动态）
  const wholeMenus = ref<RouteRecordRaw[]>([]);
  // 缓存页面keepAlive
  const cachePageList = ref<string[]>([]);

  /** [√]组装整体路由生成的菜单（最终菜单） */
  function handleWholeMenus(routes: RouteRecordRaw[]) {
    wholeMenus.value = filterNoPermissionTree(
      filterTree(ascending(constantMenus.value.concat(routes))),
    );
  }
  function cacheOperate({ mode, name }: { mode: string; name: string }) {
    if (!name) return;
    const delIndex = cachePageList.value.indexOf(name);
    switch (mode) {
      case "refresh":
        cachePageList.value = cachePageList.value.filter((v) => v !== name);
        break;
      case "add":
        cachePageList.value.push(name);
        break;
      case "delete":
        delIndex !== -1 && cachePageList.value.splice(delIndex, 1);
        break;
    }
    /** 监听缓存页面是否存在于标签页，不存在则删除 */
    debounce(() => {
      let cacheLength = cachePageList.value.length;
      const nameList: RouteRecordName[] = useTabsStore().tabList.value.map((item) =>
        item["name"] ? item["name"] : "",
      );
      while (cacheLength > 0) {
        !nameList.includes(cachePageList.value[cacheLength - 1]) &&
          cachePageList.value.splice(
            cachePageList.value.indexOf(cachePageList.value[cacheLength - 1]),
            1,
          );
        cacheLength--;
      }
    })();
  }
  /** 清空缓存页面 */
  function clearAllCachePage() {
    wholeMenus.value = [];
    cachePageList.value = [];
  }
  return {
    constantMenus,
    wholeMenus,
    cachePageList,
    handleWholeMenus,
    cacheOperate,
    clearAllCachePage,
  };
});
