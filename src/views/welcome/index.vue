<script setup lang="tsx">
import { h } from "vue";
import { AlipayCircleOutlined } from "@ant-design/icons-vue";

defineOptions({
  name: "Welcome",
});

const input = ref("");
function btn() {
  return (
    <a-button type="primary" icon={<span class="i-ant-design:alipay-circle-filled" />}>
      1231123
    </a-button>
  );
}
</script>

<template>
  <a-input v-model:value="input" placeholder="" />
  <a-button type="primary" :icon="h(AlipayCircleOutlined)">
    123123
  </a-button>
  <btn />
  <div class="h-10 w-10 dark:bg-red" />
</template>

<style lang="scss" scoped></style>
