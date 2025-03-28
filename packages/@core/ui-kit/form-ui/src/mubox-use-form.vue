<script setup lang="ts">
import type { ExtendedFormApi, MuboxFormProps } from './types';

import { useForwardPriorityValues } from '@mubox-core/composables';
// import { isFunction } from '@mubox-core/shared/utils';

import { clone } from '@mubox-core/shared/utils';
import { useDebounceFn } from '@vueuse/core';

// import { toRaw, watch } from 'vue';
import { nextTick, onMounted, watch } from 'vue';

import FormActions from './components/form-actions.vue';
import {
  COMPONENT_BIND_EVENT_MAP,
  COMPONENT_MAP,
  DEFAULT_FORM_COMMON_CONFIG,
} from './config';
import { Form } from './form-render';
import { provideFormProps, useFormInitial } from './use-form-context';
// 通过 extends 会导致热更新卡死，所以重复写了一遍
interface Props extends MuboxFormProps {
  formApi: ExtendedFormApi;
}

const props = defineProps<Props>();

const state = props.formApi?.useStore?.();

const forward = useForwardPriorityValues(props, state);

const { delegatedSlots, form } = useFormInitial(forward);

provideFormProps([forward, form]);

props.formApi?.mount?.(form);

function handleUpdateCollapsed(value: boolean) {
  props.formApi?.setState({ collapsed: !!value });
}

function handleKeyDownEnter(event: KeyboardEvent) {
  if (!state.value.submitOnEnter || !forward.value.formApi?.isMounted) {
    return;
  }
  // 如果是 textarea 不阻止默认行为，否则会导致无法换行。
  // 跳过 textarea 的回车提交处理
  if (event.target instanceof HTMLTextAreaElement) {
    return;
  }
  event.preventDefault();

  forward.value.formApi.validateAndSubmitForm();
}

const handleValuesChangeDebounced = useDebounceFn((newVal) => {
  forward.value.handleValuesChange?.(clone(newVal));
  state.value.submitOnChange && forward.value.formApi?.validateAndSubmitForm();
}, 300);

onMounted(async () => {
  // 只在挂载后开始监听，form.values会有一个初始化的过程
  await nextTick();
  watch(() => form.values, handleValuesChangeDebounced, { deep: true });
});
</script>

<template>
  <Form
    v-bind="forward"
    :collapsed="state.collapsed"
    :component-bind-event-map="COMPONENT_BIND_EVENT_MAP"
    :component-map="COMPONENT_MAP"
    :form="form"
    :global-common-config="DEFAULT_FORM_COMMON_CONFIG"
    @keydown.enter="handleKeyDownEnter"
  >
    <template
      v-for="slotName in delegatedSlots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps" />
    </template>
    <template #default="slotProps">
      <slot v-bind="slotProps">
        <FormActions
          v-if="forward.showDefaultActions"
          :model-value="state.collapsed"
          @update:model-value="handleUpdateCollapsed"
        >
          <template #reset-before="resetSlotProps">
            <slot name="reset-before" v-bind="resetSlotProps" />
          </template>
          <template #submit-before="submitSlotProps">
            <slot name="submit-before" v-bind="submitSlotProps" />
          </template>
          <template #expand-before="expandBeforeSlotProps">
            <slot name="expand-before" v-bind="expandBeforeSlotProps" />
          </template>
          <template #expand-after="expandAfterSlotProps">
            <slot name="expand-after" v-bind="expandAfterSlotProps" />
          </template>
        </FormActions>
      </slot>
    </template>
  </Form>
</template>
