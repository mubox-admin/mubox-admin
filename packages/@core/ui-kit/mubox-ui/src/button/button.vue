<script setup lang="ts">
import type { MuboxButtonProps } from './button';
import { buttonVariants } from '@mubox-core/shadcn-ui';
import { cn } from '@mubox-core/shared/utils';
import { LoaderCircle } from 'lucide-vue-next';
import { Primitive } from 'radix-vue';
import { computed } from 'vue';

interface Props extends MuboxButtonProps {}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  class: '',
  disabled: false,
  loading: false,
  size: 'default',
  variant: 'default',
});

const isDisabled = computed(() => {
  return props.disabled || props.loading;
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :disabled="isDisabled"
  >
    <LoaderCircle
      v-if="loading"
      class="text-md mr-2 size-4 flex-shrink-0 animate-spin"
    />
    <slot />
  </Primitive>
</template>
