<script setup lang="ts">
defineOptions({
  name: "Test",
});

const input = ref("");
</script>

<template>
  <a-input v-model:value="input" />
</template>
