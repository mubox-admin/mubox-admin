<script setup lang="tsx">
import { h } from "vue";
import { AlipayCircleOutlined } from "@ant-design/icons-vue";
const btn = () => (
  <a-button type="primary" icon={<span class="i-ant-design:alipay-circle-filled" />}>
    1231123
  </a-button>
);
</script>

<template>
  <a-button type="primary" :icon="h(AlipayCircleOutlined)">123123</a-button>
  <btn />
  <div class="i-ph-anchor-simple-thin" />
</template>

<style lang="scss" scoped></style>
