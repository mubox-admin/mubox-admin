<script setup lang="ts">
import type { ClassType } from '@mubox-core/typings';
import type { TooltipContentProps } from 'radix-vue';
import type { StyleValue } from 'vue';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@mubox-core/shadcn-ui';

interface Props {
  contentClass?: ClassType;
  contentStyle?: StyleValue;
  delayDuration?: number;
  side?: TooltipContentProps['side'];
}

withDefaults(defineProps<Props>(), {
  delayDuration: 0,
  side: 'right',
});
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration">
    <Tooltip>
      <TooltipTrigger as-child tabindex="-1">
        <slot name="trigger" />
      </TooltipTrigger>
      <TooltipContent
        :class="contentClass"
        :side="side"
        :style="contentStyle"
        class="side-content text-popover-foreground bg-accent rounded-md"
      >
        <slot />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
