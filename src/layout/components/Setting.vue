<script setup lang="ts">
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons-vue";
import { useUserStore } from "@/store/user";

const { logout } = useUserStore();

const isShowDrawer = ref<boolean>(false);

const openDrawer = () => {
  isShowDrawer.value = true;
};

// 暗黑模式
const isDark = useDark({ disableTransition: false });
</script>

<template>
  <div class="cursor-pointer px-4 hover:bg-gray-2 dark:hover:bg-neutral-9" @click="openDrawer">
    <SettingOutlined />
  </div>
  <a-drawer v-model:open="isShowDrawer" :title="$t('sys.base.setting')">
    <div class="flex flex-col items-center gap-xl">
      <a-divider><strong>暗黑模式</strong></a-divider>
      <a-switch v-model:checked="isDark">
        <template #checkedChildren><i class="i-ep:moon" /></template>
        <template #unCheckedChildren><i class="i-ep:sunny" /></template>
      </a-switch>
      <a-divider />
      <a-button class="w-100%" type="primary" danger @click="logout">
        <LogoutOutlined />
        退出登录
      </a-button>
    </div>
  </a-drawer>
</template>

<style lang="scss" scoped></style>
