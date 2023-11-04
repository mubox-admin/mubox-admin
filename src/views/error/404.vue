<script setup lang="ts">
import { useRouter } from "vue-router";
import noExist from "@/assets/status/404.svg?component";

defineOptions({
  name: "404",
});

const router = useRouter();
</script>

<template>
  <div class="h-[640px] flex items-center justify-center">
    <noExist v-motion-pop />
    <div class="ml-12">
      <p v-motion-slide-bottom class="mb-4 text-4xl font-medium dark:text-white">404</p>
      <p v-motion-slide-bottom class="mb-4 text-gray-500">抱歉，你访问的页面不存在</p>
      <a-button v-motion-roll-bottom type="primary" @click="router.push('/')">返回首页</a-button>
    </div>
  </div>
</template>
