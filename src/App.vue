<script setup lang="ts">
import { darkTheme } from "naive-ui";

const isDark = useDark({ disableTransition: false });
const themeOverrides = {
  common: {
    primaryColor: "#3451B2EB",
    primaryColorHover: "#3451B2C9",
    primaryColorPressed: "#3451B2FF",
    primaryColorSuppl: "#3451B2FF",
    invertedColor: "#2C2D2D",
  },
};
</script>

<template>
  <n-config-provider
    :theme="isDark ? darkTheme : null"
    :theme-overrides="themeOverrides"
  >
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped></style>
