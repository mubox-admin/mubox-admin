<script setup lang="ts">
import { LogInOutline, Moon, SettingsOutline, Sunny } from "@vicons/ionicons5";

import { useUserStore } from "@/store/user";

const { logout } = useUserStore();

const isShowDrawer = ref<boolean>(false);

function openDrawer() {
  isShowDrawer.value = true;
}

// 暗黑模式
const isDark = useDark({ disableTransition: false });
</script>

<template>
  <div class="cursor-pointer px-4 hover:bg-gray-2 dark:hover:bg-neutral-9" @click="openDrawer">
    <n-icon :component="SettingsOutline" />
  </div>
  <n-drawer v-model:show="isShowDrawer" :default-width="350">
    <n-divider><strong>暗黑模式</strong></n-divider>
    <n-drawer-content>
      <div class="flex flex-col items-center gap-xl">
        <n-switch v-model:value="isDark">
          <template #checked-icon>
            <n-icon :component="Moon" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="Sunny" />
          </template>
        </n-switch>
        <n-divider />
        <n-button class="w-100%" type="primary" danger @click="logout">
          退出登录
          <n-icon :component="LogInOutline" />
        </n-button>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped></style>
