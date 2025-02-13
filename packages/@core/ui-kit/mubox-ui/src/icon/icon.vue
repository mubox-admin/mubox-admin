<script setup lang="ts">
import type { Component } from 'vue';

import { Icon as IconifyIcon } from '@iconify/vue';
import {
  isBase64,
  isFileUrl,
  isFunction,
  isHttpUrl,
  isObject,
  isString,
} from '@mubox-core/shared/utils';
import { Menu } from 'lucide-vue-next';

defineProps<{
  // 没有是否显示默认图标
  fallback?: boolean;
  icon?: Component | Function | string;
}>();

const iconifyRegex = /^[a-z-]+:[a-z-]+$/i;
</script>

<template>
  <component
    :is="icon"
    v-if="!isString(icon) && (isObject(icon) || isFunction(icon))"
    v-bind="$attrs"
  />
  <img
    v-else-if="
      isString(icon) && (isHttpUrl(icon) || isFileUrl(icon) || isBase64(icon))
    "
    :src="icon"
    v-bind="$attrs"
  >
  <IconifyIcon
    v-else-if="isString(icon) && iconifyRegex.test(icon)"
    v-bind="$attrs"
    :icon="icon"
  />
  <Menu v-else-if="fallback" v-bind="$attrs" />
</template>
