<script lang="ts" setup>
import type { BackTopProps } from './back-top';

import { ArrowUpToLine } from 'lucide-vue-next';
import { computed } from 'vue';
import { MuboxButton } from '../button';
import { useBackTop } from './use-back-top';

interface Props extends BackTopProps {}

defineOptions({ name: 'BackTop' });

const props = withDefaults(defineProps<Props>(), {
  bottom: 20,
  isGroup: false,
  right: 24,
  target: '',
  visibilityHeight: 200,
});

const backTopStyle = computed(() => ({
  bottom: `${props.bottom}px`,
  right: `${props.right}px`,
}));

const { handleClick, visible } = useBackTop(props);
</script>

<template>
  <transition name="fade-down">
    <MuboxButton
      v-if="visible"
      :style="backTopStyle"
      class="dark:bg-accent dark:hover:bg-heavy bg-background hover:bg-heavy data shadow-float fixed bottom-10 z-[1000] size-10 rounded-full duration-500"
      size="icon"
      variant="icon"
      @click="handleClick"
    >
      <ArrowUpToLine class="size-4" />
    </MuboxButton>
  </transition>
</template>
