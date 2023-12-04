import router from "@/router";

export const useMenuStore = createGlobalState(() => {
  const menuState = ref({
    selectedKeys: ["Welcome"],
    openKeys: ["Home"] as string[],
    collapsed: false,
  });

  function backToFrontPage() {
    menuState.value.selectedKeys = ["Welcome"];
    menuState.value.openKeys = ["Home"];
    router.push("/");
  }
  return { menuState, backToFrontPage };
});
