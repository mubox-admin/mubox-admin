<script setup lang="ts">
import type { ButtonVariants } from '@mubox-core/shadcn-ui';
import type { MuboxButtonProps } from './button';
import { cn } from '@mubox-core/shared/utils';
import { computed, useSlots } from 'vue';
import { MuboxTooltip } from '../tooltip';
import MuboxButton from './button.vue';

interface Props extends MuboxButtonProps {
  class?: any;
  disabled?: boolean;
  onClick?: () => void;
  tooltip?: string;
  tooltipDelayDuration?: number;
  tooltipSide?: 'bottom' | 'left' | 'right' | 'top';
  variant?: ButtonVariants;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  onClick: () => {},
  tooltipDelayDuration: 200,
  tooltipSide: 'bottom',
  variant: 'icon',
});

const slots = useSlots();

const showTooltip = computed(() => !!slots.tooltip || !!props.tooltip);
</script>

<template>
  <MuboxButton
    v-if="!showTooltip"
    :class="cn('rounded-full', props.class)"
    :disabled="disabled"
    :variant="variant"
    size="icon"
    @click="onClick"
  >
    <slot />
  </MuboxButton>

  <MuboxTooltip
    v-else
    :delay-duration="tooltipDelayDuration"
    :side="tooltipSide"
  >
    <template #trigger>
      <MuboxButton
        :class="cn('rounded-full', props.class)"
        :disabled="disabled"
        :variant="variant"
        size="icon"
        @click="onClick"
      >
        <slot />
      </MuboxButton>
    </template>
    <slot v-if="slots.tooltip" name="tooltip" />
    <template v-else>
      {{ tooltip }}
    </template>
  </MuboxTooltip>
</template>
