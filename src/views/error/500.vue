<script setup lang="ts">
import noServer from "@/assets/status/500.svg?component";
import { useMenuStore } from "@/store/menu";

defineOptions({
  name: "500",
});
const { backToFrontPage } = useMenuStore();
</script>

<template>
  <div class="h-[640px] flex items-center justify-center">
    <noServer v-motion-pop />
    <div class="ml-12">
      <p v-motion-slide-bottom class="mb-4 text-4xl font-medium dark:text-white">
        500
      </p>
      <p v-motion-slide-bottom class="mb-4 text-gray-500">
        抱歉，服务器出错了
      </p>
      <a-button v-motion-roll-bottom type="primary" @click="backToFrontPage">
        返回首页
      </a-button>
    </div>
  </div>
</template>
