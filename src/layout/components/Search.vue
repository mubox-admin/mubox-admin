<script setup lang="ts">
import { isArray, isString } from "@mubox/utils";
import { useRouter } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import type { SelectOption } from "naive-ui";
import { Search } from "@vicons/ionicons5";
import { usePermissionStore } from "@/store/permission";

const menuSearch = ref("");
const { wholeMenus } = usePermissionStore();

/** 将菜单树形结构扁平化为一维数组，用于菜单查询 */
const menuSearchList = ref<SelectOption[]>([]);

function traverseRouteName(routes: RouteRecordRaw[]) {
  if (isArray(routes)) {
    routes.forEach((item) => {
    // 这里只添加有实例组件的路由查询
      if (item.name && item.component) {
        menuSearchList.value.push({
          label: item.meta?.title,
          value: isString(item.name) ? item.name : undefined,
        });
      }
      if (item.children)
        traverseRouteName(item.children);
    });
  }
}
traverseRouteName(wholeMenus.value);

const router = useRouter();
function toPage(route: string) {
  router.push({ name: route });
}
</script>

<template>
  <n-select
    v-model:value="menuSearch"
    filterable
    class="lh-10"
    :options="menuSearchList"
    @update:value="toPage"
  >
    <template #suffix>
      <n-icon :component="Search" />
    </template>
  </n-select>
</template>
