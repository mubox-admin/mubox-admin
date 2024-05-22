<script setup lang="ts">
import { useUserStore } from "@/store/user";

const { userInfo, logout } = useUserStore();
const options = [
  {
    label: "退出登录",
    key: "logout",
  },
];
function handleSelect(key: string) {
  switch (key) {
    case "logout":
      logout();
      break;
  }
}
</script>

<template>
  <n-dropdown :options="options" trigger="hover" @select="handleSelect">
    <n-flex align="center" class="cursor-pointer px-2 hover:bg-gray-2 dark:hover:bg-neutral-9">
      <n-avatar :src="userInfo?.avatar" round />
      <span>{{ userInfo?.username }}</span>
    </n-flex>
  </n-dropdown>
</template>

<style lang="scss" scoped></style>
