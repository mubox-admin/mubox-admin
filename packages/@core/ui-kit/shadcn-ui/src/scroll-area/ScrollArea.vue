<script setup lang="ts">
import type { ScrollAreaRootProps } from 'radix-vue';

import { cn } from '@mubox-core/shared/utils';

import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaViewport,
} from 'radix-vue';

import { computed } from 'vue';

import ScrollBar from './ScrollBar.vue';

const props = withDefaults(
  defineProps<
    ScrollAreaRootProps & {
      class?: any;
      onScroll?: (event: Event) => void;
      viewportProps?: { onScroll: (event: Event) => void };
    }
  >(),
  {
    onScroll: () => {},
  },
);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <ScrollAreaRoot
    v-bind="delegatedProps"
    :class="cn('relative overflow-hidden', props.class)"
  >
    <ScrollAreaViewport
      as-child
      class="h-full w-full rounded-[inherit] focus:outline-none"
      @scroll="onScroll"
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
