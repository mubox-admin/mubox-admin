<script setup lang="ts">
import { useUserStore } from "@/store/user";

const { userInfo, logout } = useUserStore();
</script>

<template>
  <a-dropdown :trigger="['click']">
    <div class="cursor-pointer px-2 hover:bg-gray-2 dark:hover:bg-neutral-9">
      <a-avatar :src="userInfo?.avatar" size="small">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      {{ userInfo?.username }}
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item @click="logout">
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style lang="scss" scoped></style>
