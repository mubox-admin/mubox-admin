<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'radix-vue';

import { Checkbox } from '@mubox-core/shadcn-ui';
import { useForwardPropsEmits } from 'radix-vue';
import { useId } from 'vue';

const props = defineProps<CheckboxRootProps>();

const emits = defineEmits<CheckboxRootEmits>();

const checked = defineModel<boolean>('checked');

const forwarded = useForwardPropsEmits(props, emits);

const id = useId();
</script>

<template>
  <div class="flex items-center">
    <Checkbox v-bind="forwarded" :id="id" v-model:checked="checked" />
    <label :for="id" class="ml-2 cursor-pointer text-sm"> <slot /> </label>
  </div>
</template>
