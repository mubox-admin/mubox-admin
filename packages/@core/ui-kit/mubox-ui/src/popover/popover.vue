<script setup lang="ts">
import type { ClassType } from '@mubox-core/typings';

import type {
  PopoverContentProps,
  PopoverRootEmits,
  PopoverRootProps,
} from 'radix-vue';

import {
  PopoverContent,
  Popover as PopoverRoot,
  PopoverTrigger,
} from '@mubox-core/shadcn-ui';

import { useForwardPropsEmits } from 'radix-vue';

import { computed } from 'vue';

interface Props extends PopoverRootProps {
  class?: ClassType;
  contentClass?: ClassType;
  contentProps?: PopoverContentProps;
}

const props = withDefaults(defineProps<Props>(), {});

const emits = defineEmits<PopoverRootEmits>();

const delegatedProps = computed(() => {
  const {
    class: _cls,
    contentClass: _,
    contentProps: _cProps,
    ...delegated
  } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <PopoverRoot v-bind="forwarded">
    <PopoverTrigger>
      <slot name="trigger" />

      <PopoverContent
        :class="contentClass"
        class="side-content z-[1000]"
        v-bind="contentProps"
      >
        <slot />
      </PopoverContent>
    </PopoverTrigger>
  </PopoverRoot>
</template>
