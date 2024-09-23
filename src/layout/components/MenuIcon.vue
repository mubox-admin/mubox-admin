<script setup lang="ts">
defineProps<{
  icon: string;
}>();
</script>

<template>
  <n-icon>
    <component :is="icon" />
  </n-icon>
</template>
