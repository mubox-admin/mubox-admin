<script setup lang="ts">
import type { MenuRecordRaw } from '@mubox-core/typings';

import { computed } from 'vue';

import { MenuBadge, MenuItem, SubMenu } from '.';
// eslint-disable-next-line import/no-self-import
import MenuTree from './menu-tree.vue';

interface Props {
  /**
   * 菜单项
   */
  menu: MenuRecordRaw;
}

defineOptions({
  name: 'MenuTree',
});

const props = withDefaults(defineProps<Props>(), {});

/**
 * 判断是否有子节点，动态渲染 menu-item/sub-menu-item
 */
const hasChildren = computed(() => {
  const { menu } = props;
  return (
    Reflect.has(menu, 'children') && !!menu.children && menu.children.length > 0
  );
});
</script>

<template>
  <MenuItem
    v-if="!hasChildren"
    :key="menu.path"
    :active-icon="menu.activeIcon"
    :badge="menu.badge"
    :badge-type="menu.badgeType"
    :badge-variants="menu.badgeVariants"
    :icon="menu.icon"
    :path="menu.path"
  >
    <template #title>
      <span>{{ menu.name }}</span>
    </template>
  </MenuItem>
  <SubMenu
    v-else
    :key="`${menu.path}_sub`"
    :active-icon="menu.activeIcon"
    :icon="menu.icon"
    :path="menu.path"
  >
    <template #content>
      <MenuBadge
        :badge="menu.badge"
        :badge-type="menu.badgeType"
        :badge-variants="menu.badgeVariants"
        class="right-6"
      />
    </template>
    <template #title>
      <span>{{ menu.name }}</span>
    </template>
    <template v-for="childItem in menu.children || []" :key="childItem.path">
      <!-- 组件递归构建菜单树 -->
      <MenuTree :menu="childItem" />
    </template>
  </SubMenu>
</template>
