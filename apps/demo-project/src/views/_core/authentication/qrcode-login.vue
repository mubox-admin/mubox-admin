<script lang="ts" setup>
import { LOGIN_PATH } from '#/constants/core';
import { AuthenticationQrCodeLogin } from '@mubox/views';

defineOptions({ name: 'QrCodeLogin' });
</script>

<template>
  <AuthenticationQrCodeLogin :login-path="LOGIN_PATH" />
</template>
