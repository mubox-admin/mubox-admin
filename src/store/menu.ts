import router from "@/router";
import { BASIC_ROUTE } from "@/router/enums";

export const useMenuStore = createGlobalState(() => {
  const menuState = ref({
    selectedKeys: "",
    collapsed: false,
  });

  function backToFrontPage() {
    menuState.value.selectedKeys = BASIC_ROUTE.WELCOME;
    router.push("/");
  }
  // 菜单定位
  function menuPositioning(routeName: string) {
    menuState.value.selectedKeys = routeName;
  }
  // 页面刷新时菜单需要重新定位
  onMounted(() => {
    if (router.currentRoute.value.name)
      menuPositioning(router.currentRoute.value.name as string);
  });
  return { menuState, backToFrontPage, menuPositioning };
});
