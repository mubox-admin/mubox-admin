<script setup lang="ts">
import type { CaptchaPoint, PointSelectionCaptchaProps } from '../types';

import { useSimpleLocale } from '@mubox-core/composables';

import { MuboxButton, MuboxIconButton } from '@mubox-core/mubox-ui';

import { RotateCw } from 'lucide-vue-next';
import { useCaptchaPoints } from '../hooks/useCaptchaPoints';
import CaptchaCard from './point-selection-captcha-card.vue';

const props = withDefaults(defineProps<PointSelectionCaptchaProps>(), {
  height: '220px',
  hintImage: '',
  hintText: '',
  paddingX: '12px',
  paddingY: '16px',
  showConfirm: false,
  title: '',
  width: '300px',
});
const emit = defineEmits<{
  click: [CaptchaPoint];
  confirm: [Array<CaptchaPoint>, clear: () => void];
  refresh: [];
}>();

const { $st } = useSimpleLocale();

const { addPoint, clearPoints, points } = useCaptchaPoints();

if (!props.hintImage && !props.hintText) {
  console.warn('At least one of hint image or hint text must be provided');
}

const POINT_OFFSET = 11;

function getElementPosition(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
  };
}

function handleClick(e: MouseEvent) {
  try {
    const dom = e.currentTarget as HTMLElement;
    if (!dom)
      throw new Error('Element not found');

    const { x: domX, y: domY } = getElementPosition(dom);

    const mouseX = e.clientX + window.scrollX;
    const mouseY = e.clientY + window.scrollY;

    if (typeof mouseX !== 'number' || typeof mouseY !== 'number') {
      throw new TypeError('Mouse coordinates not found');
    }

    const xPos = mouseX - domX;
    const yPos = mouseY - domY;

    const rect = dom.getBoundingClientRect();

    // 点击位置边界校验
    if (xPos < 0 || yPos < 0 || xPos > rect.width || yPos > rect.height) {
      console.warn('Click position is out of the valid range');
      return;
    }

    const x = Math.ceil(xPos);
    const y = Math.ceil(yPos);

    const point = {
      i: points.length,
      t: Date.now(),
      x,
      y,
    };

    addPoint(point);

    emit('click', point);
    e.stopPropagation();
    e.preventDefault();
  }
  catch (error) {
    console.error('Error in handleClick:', error);
  }
}

function clear() {
  try {
    clearPoints();
  }
  catch (error) {
    console.error('Error in clear:', error);
  }
}

function handleRefresh() {
  try {
    clear();
    emit('refresh');
  }
  catch (error) {
    console.error('Error in handleRefresh:', error);
  }
}

function handleConfirm() {
  if (!props.showConfirm)
    return;
  try {
    emit('confirm', points, clear);
  }
  catch (error) {
    console.error('Error in handleConfirm:', error);
  }
}
</script>

<template>
  <CaptchaCard
    :captcha-image="captchaImage"
    :height="height"
    :padding-x="paddingX"
    :padding-y="paddingY"
    :title="title"
    :width="width"
    @click="handleClick"
  >
    <template #title>
      <slot name="title">
        {{ $st('captchaTitle') }}
      </slot>
    </template>

    <template #extra>
      <MuboxIconButton
        :aria-label="$st('refreshAriaLabel')"
        class="ml-1"
        @click="handleRefresh"
      >
        <RotateCw class="size-5" />
      </MuboxIconButton>
      <MuboxButton
        v-if="showConfirm"
        :aria-label="$st('confirmAriaLabel')"
        class="ml-2"
        size="sm"
        @click="handleConfirm"
      >
        {{ $st('confirm') }}
      </MuboxButton>
    </template>

    <div
      v-for="(point, index) in points"
      :key="index"
      :aria-label="$st('pointAriaLabel') + (index + 1)"
      :style="{
        top: `${point.y - POINT_OFFSET}px`,
        left: `${point.x - POINT_OFFSET}px`,
      }"
      class="bg-primary text-primary-50 border-primary-50 absolute z-20 flex h-5 w-5 cursor-default items-center justify-center rounded-full border-2"
      role="button"
      tabindex="0"
    >
      {{ index + 1 }}
    </div>
    <template #footer>
      <img
        v-if="hintImage"
        :alt="$st('alt')"
        :src="hintImage"
        class="border-border h-10 w-full rounded border"
      >
      <div
        v-else-if="hintText"
        class="border-border flex-center h-10 w-full rounded border"
      >
        {{ `${$st('clickInOrder')}` + `【${hintText}】` }}
      </div>
    </template>
  </CaptchaCard>
</template>
