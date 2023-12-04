<script setup lang="ts">
import noAccess from "@/assets/status/403.svg?component";
import { useMenuStore } from "@/store/menu";

defineOptions({
  name: "403",
});

const { backToFrontPage } = useMenuStore();
</script>

<template>
  <div class="h-[640px] flex items-center justify-center">
    <noAccess v-motion-pop />
    <div class="ml-12">
      <p v-motion-slide-bottom class="mb-4 text-4xl font-medium dark:text-white">403</p>
      <p v-motion-slide-bottom class="mb-4 text-gray-500">抱歉，你无权访问该页面</p>
      <a-button v-motion-roll-bottom type="primary" @click="backToFrontPage">返回首页</a-button>
    </div>
  </div>
</template>
