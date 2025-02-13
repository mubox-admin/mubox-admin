<script setup lang="ts">
import type { MenuRecordRaw } from '@mubox-core/typings';

import type { MenuProps } from './types';

import { useForwardProps } from '@mubox-core/composables';

import { Menu, MenuTree } from './components';

interface Props extends MenuProps {
  menus: MenuRecordRaw[];
}

defineOptions({
  name: 'MuboxMenu',
});

const props = withDefaults(defineProps<Props>(), {
  collapse: false,
  // theme: 'dark',
});

const forward = useForwardProps(props);

// const emit = defineEmits<{
//   'update:openKeys': [key: Key[]];
//   'update:selectedKeys': [key: Key[]];
// }>();
</script>

<template>
  <Menu v-bind="forward">
    <template v-for="menu in menus" :key="menu.path">
      <MenuTree :menu="menu" />
    </template>
  </Menu>
</template>
