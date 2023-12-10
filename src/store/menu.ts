import router from "@/router";
import { getParentPaths } from "@/router/utils";

export const useMenuStore = createGlobalState(() => {
  const menuState = ref({
    selectedKeys: [] as string[],
    openKeys: ["Home"] as string[],
    collapsed: false,
  });

  function backToFrontPage() {
    menuState.value.selectedKeys = ["Welcome"];
    menuState.value.openKeys = ["Home"];
    router.push("/");
  }
  // 菜单定位
  function menuPositioning(routeName: string) {
    const parentRoutes = getParentPaths(routeName, router.options.routes, "name", "name");
    menuState.value.openKeys = parentRoutes;
    menuState.value.selectedKeys = [routeName as string];
  }
  // 页面刷新时菜单需要重新定位
  onMounted(() => {
    if (router.currentRoute.value.name) {
      menuPositioning(router.currentRoute.value.name as string);
    }
  });
  return { menuState, backToFrontPage, menuPositioning };
});
