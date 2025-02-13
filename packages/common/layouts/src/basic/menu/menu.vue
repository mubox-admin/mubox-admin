<script lang="ts" setup>
import type { MenuProps } from '@mubox-core/menu-ui';

import type { MenuRecordRaw } from '@mubox/types';

import { MuboxMenu } from '@mubox-core/menu-ui';

interface Props extends MenuProps {
  menus: MenuRecordRaw[];
}

const props = withDefaults(defineProps<Props>(), {
  accordion: true,
  menus: () => [],
});

const emit = defineEmits<{
  open: [string, string[]];
  select: [string, string?];
}>();

function handleMenuSelect(key: string) {
  emit('select', key, props.mode);
}

function handleMenuOpen(key: string, path: string[]) {
  emit('open', key, path);
}
</script>

<template>
  <MuboxMenu
    :accordion="accordion"
    :collapse="collapse"
    :collapse-show-title="collapseShowTitle"
    :default-active="defaultActive"
    :menus="menus"
    :mode="mode"
    :rounded="rounded"
    :theme="theme"
    @open="handleMenuOpen"
    @select="handleMenuSelect"
  />
</template>
