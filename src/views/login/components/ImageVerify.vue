<!-- [√] -->
<script setup lang="ts">
import { watch } from "vue";
import { useImageVerify } from "./useImageVerify";

const { code = "" } = defineProps<{
  code?: string;
}>();

const emit = defineEmits<{ (e: "update:code", code: string): void }>();

const { domRef, imgCode, setImgCode, getImgCode } = useImageVerify();

watch(
  () => code,
  (newValue) => {
    setImgCode(newValue);
  },
);
watch(imgCode, (newValue) => {
  emit("update:code", newValue);
});

defineExpose({ getImgCode });
</script>

<template>
  <canvas ref="domRef" width="120" height="40" class="cursor-pointer" @click="getImgCode" />
</template>
