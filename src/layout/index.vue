<script lang="tsx" setup>
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import { isNumber, isString } from "@mubox/utils";
import { useRouter } from "vue-router";
import type { TabsProps } from "ant-design-vue";
import type { RouteRecordRaw } from "vue-router";
import type { Route } from "ant-design-vue/es/breadcrumb/Breadcrumb";
import AntIcon from "./components/AntIcon.vue";
import Search from "./components/Search.vue";
import Setting from "./components/Setting.vue";
import User from "./components/User.vue";
import { usePermissionStore } from "@/store/permission";
import { useMenuStore } from "@/store/menu";
import { findRouteByPath, getParentPaths } from "@/router/utils";
import { useTabsStore } from "@/store/tabs";
import { BASIC_ROUTE } from "@/router/enums";

const isDark = useDark({ disableTransition: false });
const router = useRouter();

// 菜单
const { wholeMenus } = usePermissionStore();
const { menuState } = useMenuStore();
const subMenuKeys = computed(() => {
  return wholeMenus.value.map(item => item.name);
});
// 菜单抽屉展开唯一
function onOpenChange(openKeys: (string | number)[]) {
  const lastOpenKey = openKeys.at(-1) as string | undefined;
  if (lastOpenKey && openKeys.length > 1 && subMenuKeys.value.includes(lastOpenKey))
    menuState.value.openKeys = lastOpenKey ? [lastOpenKey] : [];
}

const menuItems = computed(() => {
  return routesToMenuItems(wholeMenus.value);
});
function routesToMenuItems(routes: RouteRecordRaw[]) {
  return routes.map((item) => {
    return {
      key: item.name,
      label: item.meta?.title,
      icon: () => (item.meta?.icon ? <AntIcon icon={item.meta.icon} /> : ""),
      children: item.children ? routesToMenuItems(item.children) : undefined,
    };
  });
}

function menuClick({ key }: { key: string | number }) {
  if (isNumber(key))
    throw new Error("路由Name不能为数字");
  router.push({ name: key });
}

// 面包屑
const routes = router.options.routes;
const breadcrumbItems = computed(() => {
  // 当前路由的父级路径组成的数组
  const parentRoutes = getParentPaths(router.currentRoute.value.name as string, routes, "name");
  // 存放组成面包屑的数组
  const breadcrumbArr: Route[] = [];
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
const { cachePageList } = usePermissionStore();
const { currentTab, tabList, spliceTabs } = useTabsStore();
// 刷新当前页面导致currentTab重置，而路由页面停留在刷新前
onMounted(() => {
  if (router.currentRoute.value.name && isString(router.currentRoute.value.name))
    currentTab.value = router.currentRoute.value.name;
});

const removeTag: TabsProps["onEdit"] = (targetKey) => {
  if (isString(targetKey))
    spliceTabs(targetKey);
  if (currentTab.value === targetKey) {
    const nextTag = tabList.value.at(-1)?.name;
    if (!nextTag)
      return router.replace({ name: BASIC_ROUTE.HOME });

    router.push({ name: nextTag });
    if (isString(nextTag))
      currentTab.value = nextTag;
    else
      throw new Error("当前路由name值不为string类型，无法标签化");
  }
};
</script>

<template>
  <a-layout style="height: 100vh">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="menuState.collapsed"
      breakpoint="lg"
      :trigger="null"
      collapsible
    >
      <div class="m-4 h-8 bg-cyan-400" />
      <a-menu
        v-model:selectedKeys="menuState.selectedKeys"
        v-model:openKeys="menuState.openKeys"
        :items="menuItems"
        theme="dark"
        mode="inline"
        @click="menuClick"
        @open-change="onOpenChange"
      />
    </a-layout-sider>
    <a-layout>
      <!-- 顶部栏 -->
      <a-layout-header
        :style="{ backgroundColor: isDark ? '#0c0a09' : '#f8fafc' }"
        style="height: 3rem; line-height: 3rem; padding: 0"
      >
        <div class="flex justify-between">
          <!-- 导航 -->
          <a-space>
            <MenuUnfoldOutlined
              v-if="menuState.collapsed"
              class="menu-icon"
              @click="() => (menuState.collapsed = !menuState.collapsed)"
            />
            <MenuFoldOutlined
              v-else
              class="menu-icon"
              @click="() => (menuState.collapsed = !menuState.collapsed)"
            />
            <a-breadcrumb :routes="breadcrumbItems" />
          </a-space>
          <!-- 用户设置 -->
          <a-space>
            <Search />
            <User />
            <Setting />
          </a-space>
        </div>
      </a-layout-header>

      <!-- 右侧内容区 -->
      <a-layout-content class="min-h-screen">
        <a-tabs
          v-model:activeKey="currentTab"
          hide-add
          type="editable-card"
          @change="(key) => $router.push({ name: key as string })"
          @edit="removeTag"
        >
          <a-tab-pane v-for="pane in tabList" :key="pane.name" :tab="pane.meta?.title" closable />
        </a-tabs>
        <router-view v-slot="{ Component }">
          <keep-alive :include="cachePageList">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
