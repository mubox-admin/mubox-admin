<script setup lang="ts">
defineProps<{
  icon: string;
}>();
</script>

<template>
  <component :is="icon" />
</template>
