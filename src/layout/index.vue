<script lang="tsx" setup>
import { ref } from "vue";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import { isString } from "@mubox/utils";
import { useRouter } from "vue-router";
import AntIcon from "./components/AntIcon.vue";
import type { Route } from "ant-design-vue/es/breadcrumb/Breadcrumb";
import { usePermissionStore } from "@/store/permission";
import { findRouteByPath, getParentPaths } from "@/router/utils";

const { wholeMenus } = usePermissionStore();
const menuState = ref({
  selectedKeys: ["Welcome"],
  openKeys: ["Home"] as string[],
  collapsed: false,
});
const subMenuKeys = computed(() => {
  return wholeMenus.value.map((item) => item.name);
});
function onOpenChange(openKeys: (string | number)[]) {
  const lastOpenKey = openKeys.at(-1) as string | undefined;
  if (openKeys.length > 1 && subMenuKeys.value.includes(lastOpenKey)) {
    menuState.value.openKeys = lastOpenKey ? [lastOpenKey] : [];
  }
}

const menuItems = computed(() => {
  return routesToMenuItems(wholeMenus.value);
});
function routesToMenuItems(routes: RouteConfigsTable[]) {
  return routes.map((item) => {
    return {
      key: item.name,
      label: item.meta?.title,
      icon: () => (item.meta?.icon ? <AntIcon icon={item.meta.icon} /> : ""),
      children: item.children ? routesToMenuItems(item.children) : undefined,
    };
  });
}

const router = useRouter();
const routes = router.options.routes;
const breadcrumbItems = computed(() => {
  // 当前路由的父级路径组成的数组
  const parentRoutes = getParentPaths(router.currentRoute.value.name as string, routes, "name");
  // 存放组成面包屑的数组
  const breadcrumbArr: Route[] = [];
  // 获取每个父级路径对应的路由信息
  parentRoutes.forEach((path) => {
    const route = findRouteByPath(path, routes);
    if (path !== "/" && route)
      breadcrumbArr.push({
        path: route.path,
        breadcrumbName: route.meta?.title
          ? route.meta.title
          : route.name && isString(route.name)
          ? route.name
          : "",
      });
  });
  // 加入当前路由
  breadcrumbArr.push({
    path: router.currentRoute.value.path,
    breadcrumbName: router.currentRoute.value.meta.title,
  });
  return breadcrumbArr;
});
</script>

<template>
  <a-layout style="height: 100vh">
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
        @click="({ key }) => $router.push(key as string)"
        @open-change="onOpenChange"
      />
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-space>
          <menu-unfold-outlined
            v-if="menuState.collapsed"
            class="menu-icon"
            @click="() => (menuState.collapsed = !menuState.collapsed)"
          />
          <menu-fold-outlined
            v-else
            class="menu-icon"
            @click="() => (menuState.collapsed = !menuState.collapsed)"
          />
          <a-breadcrumb :routes="breadcrumbItems" />
        </a-space>
      </a-layout-header>
      <a-layout-content class="mx-4 my-6 min-h-screen bg-white p-6">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
