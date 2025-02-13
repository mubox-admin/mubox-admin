<script setup lang="ts">
import { MuboxHelpTooltip } from '@mubox-core/mubox-ui';
import { FormLabel } from '@mubox-core/shadcn-ui';
import { cn } from '@mubox-core/shared/utils';

interface Props {
  class?: string;
  help?: string;
  required?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <FormLabel :class="cn('flex items-center', props.class)">
    <span v-if="required" class="text-destructive mr-[2px]">*</span>
    <slot />
    <MuboxHelpTooltip v-if="help" trigger-class="size-3.5 ml-1">
      {{ help }}
    </MuboxHelpTooltip>
  </FormLabel>
</template>
