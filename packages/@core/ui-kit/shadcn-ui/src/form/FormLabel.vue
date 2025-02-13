<script lang="ts" setup>
import type { LabelProps } from 'radix-vue';

import { cn } from '@mubox-core/shared/utils';

import { Label } from '../label';
import { useFormField } from './useFormField';

const props = defineProps<LabelProps & { class?: any }>();

const { formItemId } = useFormField();
</script>

<template>
  <Label :class="cn(props.class)" :for="formItemId">
    <slot />
  </Label>
</template>
