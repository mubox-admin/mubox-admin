<script setup lang="ts">
import noExist from "@/assets/status/404.svg?component";
import { useMenuStore } from "@/store/menu";

defineOptions({
  name: "404",
});

const { backToFrontPage } = useMenuStore();
</script>

<template>
  <div class="h-[640px] flex items-center justify-center">
    <noExist v-motion-pop />
    <div class="ml-12">
      <p v-motion-slide-bottom class="mb-4 text-4xl font-medium dark:text-white">
        404
      </p>
      <p v-motion-slide-bottom class="mb-4 text-gray-500">
        抱歉，你访问的页面不存在
      </p>
      <a-button v-motion-roll-bottom type="primary" @click="backToFrontPage">
        返回首页
      </a-button>
    </div>
  </div>
</template>
