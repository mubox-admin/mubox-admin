<script setup lang="ts">
import { useSimpleLocale } from '@mubox-core/composables';

import { MuboxExpandableArrow } from '@mubox-core/mubox-ui';
import {
  cn,
  formatDate,
  isFunction,
  triggerWindowResize,
} from '@mubox-core/shared/utils';
import { computed, toRaw, unref, watch } from 'vue';

import { COMPONENT_MAP } from '../config';
import { injectFormProps } from '../use-form-context';

const { $st } = useSimpleLocale();

const [rootProps, form] = injectFormProps();

const collapsed = defineModel({ default: false });

const resetButtonOptions = computed(() => {
  return {
    content: `${$st.value('reset')}`,
    show: true,
    ...unref(rootProps).resetButtonOptions,
  };
});

const submitButtonOptions = computed(() => {
  return {
    content: `${$st.value('submit')}`,
    show: true,
    ...unref(rootProps).submitButtonOptions,
  };
});

// const isQueryForm = computed(() => {
//   return !!unref(rootProps).showCollapseButton;
// });

const queryFormStyle = computed(() => {
  if (!unref(rootProps).actionWrapperClass) {
    return {
      'grid-column': `-2 / -1`,
      'marginLeft': 'auto',
    };
  }

  return {};
});

async function handleSubmit(e: Event) {
  e?.preventDefault();
  e?.stopPropagation();
  const { valid } = await form.validate();
  if (!valid) {
    return;
  }

  const values = handleRangeTimeValue(toRaw(form.values));
  await unref(rootProps).handleSubmit?.(values);
}

async function handleReset(e: Event) {
  e?.preventDefault();
  e?.stopPropagation();
  const props = unref(rootProps);

  const values = toRaw(form.values);
  // 清理时间字段
  props.fieldMappingTime
  && props.fieldMappingTime.forEach(([_, [startTimeKey, endTimeKey]]) => {
    delete values[startTimeKey];
    delete values[endTimeKey];
  });

  if (isFunction(props.handleReset)) {
    await props.handleReset?.(values);
  }
  else {
    form.resetForm();
  }
}

function handleRangeTimeValue(values: Record<string, any>) {
  const fieldMappingTime = unref(rootProps).fieldMappingTime;

  if (!fieldMappingTime || !Array.isArray(fieldMappingTime)) {
    return values;
  }

  fieldMappingTime.forEach(
    ([field, [startTimeKey, endTimeKey], format = 'YYYY-MM-DD']) => {
      if (startTimeKey && endTimeKey && values[field] === null) {
        delete values[startTimeKey];
        delete values[endTimeKey];
      }

      if (!values[field]) {
        delete values[field];
        return;
      }

      const [startTime, endTime] = values[field];
      const [startTimeFormat, endTimeFormat] = Array.isArray(format)
        ? format
        : [format, format];

      values[startTimeKey] = startTime
        ? formatDate(startTime, startTimeFormat)
        : undefined;
      values[endTimeKey] = endTime
        ? formatDate(endTime, endTimeFormat)
        : undefined;

      delete values[field];
    },
  );

  return values;
}

watch(
  () => collapsed.value,
  () => {
    const props = unref(rootProps);
    if (props.collapseTriggerResize) {
      triggerWindowResize();
    }
  },
);

defineExpose({
  handleReset,
  handleSubmit,
});
</script>

<template>
  <div
    :class="
      cn(
        'col-span-full w-full text-right',
        rootProps.compact ? 'pb-2' : 'pb-6',
        rootProps.actionWrapperClass,
      )
    "
    :style="queryFormStyle"
  >
    <template v-if="rootProps.actionButtonsReverse">
      <!-- 提交按钮前 -->
      <slot name="submit-before" />

      <component
        :is="COMPONENT_MAP.PrimaryButton"
        v-if="submitButtonOptions.show"
        class="ml-3"
        type="button"
        v-bind="submitButtonOptions"
        @click="handleSubmit"
      >
        {{ submitButtonOptions.content }}
      </component>
    </template>

    <!-- 重置按钮前 -->
    <slot name="reset-before" />

    <component
      :is="COMPONENT_MAP.DefaultButton"
      v-if="resetButtonOptions.show"
      class="ml-3"
      type="button"
      v-bind="resetButtonOptions"
      @click="handleReset"
    >
      {{ resetButtonOptions.content }}
    </component>

    <template v-if="!rootProps.actionButtonsReverse">
      <!-- 提交按钮前 -->
      <slot name="submit-before" />

      <component
        :is="COMPONENT_MAP.PrimaryButton"
        v-if="submitButtonOptions.show"
        class="ml-3"
        type="button"
        v-bind="submitButtonOptions"
        @click="handleSubmit"
      >
        {{ submitButtonOptions.content }}
      </component>
    </template>

    <!-- 展开按钮前 -->
    <slot name="expand-before" />

    <MuboxExpandableArrow
      v-if="rootProps.showCollapseButton"
      v-model:model-value="collapsed"
      class="ml-2"
    >
      <span>{{ collapsed ? $st('expand') : $st('collapse') }}</span>
    </MuboxExpandableArrow>

    <!-- 展开按钮后 -->
    <slot name="expand-after" />
  </div>
</template>
