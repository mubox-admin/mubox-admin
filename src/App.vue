<script setup lang="ts">
import { darkTheme } from "naive-ui";
import { useSettingStore } from "./store/setting";
import { localeMap } from "./locales";
import { themeOverrides } from "@/style/theme/index";

const isDark = useDark({ disableTransition: false });
</script>

<template>
  <n-config-provider
    :theme="isDark ? darkTheme : null"
    :theme-overrides="themeOverrides"
    :locale="localeMap[useSettingStore().projectSetting.value.locale]"
  >
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped></style>
