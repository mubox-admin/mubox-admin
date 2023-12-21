<script setup lang="ts">
import { isArray } from "@mubox/utils";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import type { DefaultOptionType } from "ant-design-vue/es/select";
import type { RouteRecordName, RouteRecordRaw } from "vue-router";
import { usePermissionStore } from "@/store/permission";

const menuSearch = ref();
const { wholeMenus } = usePermissionStore();

/** 将菜单树形结构扁平化为一维数组，用于菜单查询 */
const menuSearchList = ref<(DefaultOptionType & { routeName?: RouteRecordName })[]>([]);
function traverseRouteName(routes: RouteRecordRaw[]) {
  if (isArray(routes))
    routes.forEach((item) => {
      // 这里只添加有实例组件的路由查询
      if (item.name && item.component)
        menuSearchList.value.push({
          label: item.meta?.title,
          value: item.meta?.title,
          routeName: item.name,
        });
      item.children && traverseRouteName(item.children);
    });
}
traverseRouteName(wholeMenus.value);

const router = useRouter();
function toPage(_, route: DefaultOptionType & { routeName?: RouteRecordName }) {
  router.push({ name: route.routeName });
}
</script>

<template>
  <a-auto-complete
    v-model:value="menuSearch"
    class="w-48"
    :options="menuSearchList"
    filter-option
    @change="toPage"
  >
    <a-input allow-clear>
      <template #suffix>
        <SearchOutlined />
      </template>
    </a-input>
  </a-auto-complete>
</template>
