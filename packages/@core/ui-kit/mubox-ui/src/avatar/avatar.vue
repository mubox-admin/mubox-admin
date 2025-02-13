<script setup lang="ts">
import type { ClassType } from '@mubox-core/typings';

import type {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarRootProps,
} from 'radix-vue';

import { Avatar, AvatarFallback, AvatarImage } from '@mubox-core/shadcn-ui';

import { computed } from 'vue';

interface Props extends AvatarFallbackProps, AvatarImageProps, AvatarRootProps {
  alt?: string;
  class?: ClassType;
  dot?: boolean;
  dotClass?: ClassType;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  alt: 'avatar',
  as: 'button',
  dot: false,
  dotClass: 'bg-green-500',
});

const text = computed(() => {
  return props.alt.slice(-2).toUpperCase();
});
</script>

<template>
  <div :class="props.class" class="relative flex flex-shrink-0 items-center">
    <Avatar :class="props.class" class="size-full">
      <AvatarImage :alt="alt" :src="src" />
      <AvatarFallback>{{ text }}</AvatarFallback>
    </Avatar>
    <span
      v-if="dot"
      :class="dotClass"
      class="border-background absolute bottom-0 right-0 size-3 rounded-full border-2"
    />
  </div>
</template>
