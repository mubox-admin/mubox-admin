<script setup lang="ts">
import { cn } from '@mubox-core/shared/utils';

const props = defineProps<{
  class?: any;
}>();
</script>

<template>
  <p :class="cn('text-muted-foreground text-sm', props.class)">
    <slot />
  </p>
</template>
