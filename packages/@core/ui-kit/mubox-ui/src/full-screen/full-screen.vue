<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core';

import { Maximize, Minimize } from 'lucide-vue-next';

import { MuboxIconButton } from '../button';

defineOptions({ name: 'FullScreen' });

const { isFullscreen, toggle } = useFullscreen();

// 重新检查全屏状态
isFullscreen.value = !!(
  document.fullscreenElement
  // @ts-expect-error 不同浏览器兼容
  || document.webkitFullscreenElement
  // @ts-expect-error 不同浏览器兼容
  || document.mozFullScreenElement
  // @ts-expect-error 不同浏览器兼容
  || document.msFullscreenElement
);
</script>

<template>
  <MuboxIconButton @click="toggle">
    <Minimize v-if="isFullscreen" class="text-foreground size-4" />
    <Maximize v-else class="text-foreground size-4" />
  </MuboxIconButton>
</template>
