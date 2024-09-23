<script lang="tsx" setup>
import { isNumber, isString } from "@mubox/utils";
import { useRouter } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import MenuIcon from "./components/MenuIcon.vue";
import Search from "./components/Search.vue";
import Setting from "./components/Setting.vue";
import User from "./components/User.vue";
import Logo from "@/assets/basic/logo.svg";
import { usePermissionStore } from "@/store/permission";
import { useMenuStore } from "@/store/menu";
import { findRouteByPath, getParentPaths } from "@/router/utils";
import { useTabsStore } from "@/store/tabs";
import { BASIC_ROUTE } from "@/router/enums";
import { useSettingStore } from "@/store/setting";

const isDark = useDark({ disableTransition: false });
const router = useRouter();

// 菜单
const { wholeMenus } = usePermissionStore();
const { menuState } = useMenuStore();
const { projectSetting } = useSettingStore();

const menuItems = computed(() => {
  return routesToMenuItems(wholeMenus.value);
});
function routesToMenuItems(routes: RouteRecordRaw[]) {
  return routes.map((item) => {
    return {
      key: item.name,
      label: item.meta?.title,
      icon: () => (item.meta?.icon ? <MenuIcon icon={item.meta.icon} /> : ""),
      children: item.children ? routesToMenuItems(item.children) : undefined,
    };
  });
}

function menuClick(key: string | number) {
  if (isNumber(key))
    throw new Error("路由Name不能为数字");
  router.push({ name: key });
}

// 面包屑
const routes = router.options.routes;
const breadcrumbItems = computed(() => {
  // 当前路由的父级路径组成的数组
  const parentRoutes = getParentPaths(
    router.currentRoute.value.name as string,
    routes,
    "name",
  );
  // 存放组成面包屑的数组
  const breadcrumbArr: any[] = [];
  // 获取每个父级路径对应的路由信息
  parentRoutes.forEach((path) => {
    const route = findRouteByPath(path, routes);
    if (path !== "/" && route) {
      breadcrumbArr.push({
        path: route.path,
        breadcrumbName: route.meta?.title
          ? route.meta.title
          : route.name && isString(route.name)
            ? route.name
            : "",
      });
    }
  });
  // 加入当前路由
  breadcrumbArr.push({
    path: router.currentRoute.value.path,
    breadcrumbName: router.currentRoute.value.meta.title,
  });
  return breadcrumbArr;
});
// 页面缓存
const { currentTab, tabList, cachePageList, spliceTabs } = useTabsStore();
// 刷新当前页面导致currentTab重置，而路由页面停留在刷新前
onMounted(() => {
  if (
    router.currentRoute.value.name
    && isString(router.currentRoute.value.name)
  ) {
    currentTab.value = router.currentRoute.value.name;
  }
});

function removeTab(targetKey) {
  if (isString(targetKey))
    spliceTabs(targetKey);
  if (currentTab.value === targetKey) {
    const nextTag = tabList.value.at(-1)?.name;
    if (!nextTag)
      return router.replace({ name: BASIC_ROUTE.HOME });

    router.push({ name: nextTag });
    if (isString(nextTag))
      currentTab.value = nextTag;
    else throw new Error("当前路由name值不为string类型，无法标签化");
  }
}
</script>

<template>
  <n-layout class="admin-layout" has-sider>
    <!-- 侧边栏 -->
    <n-layout-sider
      bordered
      inverted
      collapse-mode="width"
      show-trigger="bar"
      :collapsed="menuState.collapsed"
      @collapse="menuState.collapsed = true"
      @expand="menuState.collapsed = false"
    >
      <div v-if="projectSetting.sideBarSetting.showLogo" class="mt-4 w-2">
        <Logo />
      </div>
      <n-menu
        v-model:value="menuState.selectedKeys"
        :options="menuItems"
        inverted
        accordion
        @update:value="menuClick"
      />
    </n-layout-sider>
    <n-layout class="min-h-screen">
      <!-- 顶部栏 -->
      <n-layout-header
        :style="{ backgroundColor: isDark ? '#0c0a09' : '#f8fafc' }"
        style="height: 3rem; line-height: 3rem; padding: 0"
      >
        <n-flex justify="space-between">
          <!-- 导航 -->
          <n-space>
            <n-breadcrumb :routes="breadcrumbItems" />
          </n-space>
          <!-- 用户设置 -->
          <n-space>
            <Search />
            <User />
            <Setting />
          </n-space>
        </n-flex>
      </n-layout-header>

      <!-- 右侧内容区 -->
      <n-layout-content>
        <n-tabs
          v-model:value="currentTab"
          type="card"
          closable
          @update:value="(key) => $router.push({ name: key as string })"
          @close="removeTab"
        >
          <n-tab-pane
            v-for="pane in tabList"
            :key="pane.name"
            :name="(pane.name as string)"
            :tab="pane.meta?.title"
          />
        </n-tabs>
        <n-scrollbar style="max-height: calc(100vh - 48px - 55px)">
          <router-view v-slot="{ Component }">
            <keep-alive :include="cachePageList">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </n-scrollbar>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style lang="scss">
.admin-layout {
  .n-layout-sider-scroll-container {
    overflow: hidden !important;
  }
}
</style>
