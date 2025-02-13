<script lang="ts" setup>
import type { MuboxNormalMenuProps } from '@mubox-core/menu-ui';

import type { MenuRecordRaw } from '@mubox/types';

import { MuboxNormalMenu } from '@mubox-core/menu-ui';
import { findMenuByPath } from '@mubox/utils';

import { onBeforeMount } from 'vue';

import { useRoute } from 'vue-router';

interface Props extends MuboxNormalMenuProps {}

const props = defineProps<Props>();

const emit = defineEmits<{
  defaultSelect: [MenuRecordRaw, MenuRecordRaw?];
  enter: [MenuRecordRaw];
  select: [MenuRecordRaw];
}>();

const route = useRoute();

onBeforeMount(() => {
  const menu = findMenuByPath(props.menus || [], route.path);
  if (menu) {
    const rootMenu = (props.menus || []).find(
      item => item.path === menu.parents?.[0],
    );
    emit('defaultSelect', menu, rootMenu);
  }
});
</script>

<template>
  <MuboxNormalMenu
    :active-path="activePath"
    :collapse="collapse"
    :menus="menus"
    :rounded="rounded"
    :theme="theme"
    @enter="(menu) => emit('enter', menu)"
    @select="(menu) => emit('select', menu)"
  />
</template>
