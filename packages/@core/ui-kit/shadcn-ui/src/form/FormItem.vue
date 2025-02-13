<script lang="ts" setup>
import { cn } from '@mubox-core/shared/utils';

import { provide, useId } from 'vue';

import { FORM_ITEM_INJECTION_KEY } from './injectionKeys';

const props = defineProps<{
  class?: any;
}>();

const id = useId() as string;
provide(FORM_ITEM_INJECTION_KEY, id);
</script>

<template>
  <div :class="cn(props.class)">
    <slot />
  </div>
</template>
