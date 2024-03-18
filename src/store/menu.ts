import { usePermissionStore } from "./permission";
import router from "@/router";
import { BASIC_ROUTE } from "@/router/enums";
import { getParentPaths } from "@/router/utils";

export const useMenuStore = createGlobalState(() => {
  const menuState = ref({
    selectedKeys: [] as string[],
    openKeys: [BASIC_ROUTE.HOME] as string[],
    collapsed: false,
  });

  function backToFrontPage() {
    menuState.value.selectedKeys = [BASIC_ROUTE.WELCOME];
    menuState.value.openKeys = [BASIC_ROUTE.HOME];
    router.push("/");
  }
  // 菜单定位
  function menuPositioning(routeName: string) {
    const { wholeMenus } = usePermissionStore();
    const parentRoutes = getParentPaths(routeName, wholeMenus.value, "name", "name");
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
