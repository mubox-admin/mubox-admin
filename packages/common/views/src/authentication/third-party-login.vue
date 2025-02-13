<script setup lang="ts">
import { MuboxIcon, MuboxIconButton } from '@mubox-core/mubox-ui';

import { $t } from '@mubox/locales';

defineOptions({
  name: 'ThirdPartyLogin',
});
</script>

<template>
  <div class="w-full sm:mx-auto md:max-w-md">
    <div class="mt-4 flex items-center justify-between">
      <span class="border-input w-[35%] border-b dark:border-gray-600" />
      <span class="text-muted-foreground text-center text-xs uppercase">
        {{ $t('authentication.thirdPartyLogin') }}
      </span>
      <span class="border-input w-[35%] border-b dark:border-gray-600" />
    </div>

    <div class="mt-4 flex flex-wrap justify-center">
      <MuboxIconButton class="mb-3">
        <MuboxIcon icon="mdi:wechat" />
      </MuboxIconButton>
      <MuboxIconButton class="mb-3">
        <MuboxIcon icon="mdi:qqchat" />
      </MuboxIconButton>
      <MuboxIconButton class="mb-3">
        <MuboxIcon icon="mdi:github" />
      </MuboxIconButton>
      <MuboxIconButton class="mb-3">
        <MuboxIcon icon="mdi:google" />
      </MuboxIconButton>
    </div>
  </div>
</template>
