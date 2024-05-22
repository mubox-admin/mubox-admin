<script setup lang="ts">
defineOptions({
  name: "Test",
});

const input = ref("");
</script>

<template>
  <n-input v-model:value="input" />
</template>
