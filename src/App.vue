<script setup lang="ts">
import { theme } from "ant-design-vue";

const isDark = useDark({ disableTransition: false });
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<style lang="scss" scoped></style>
