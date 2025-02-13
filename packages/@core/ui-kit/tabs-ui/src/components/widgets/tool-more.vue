<script lang="ts" setup>
import type { DropdownMenuProps } from '@mubox-core/mubox-ui';

import { MuboxDropdownMenu } from '@mubox-core/mubox-ui';
import { ChevronDown } from 'lucide-vue-next';

defineProps<DropdownMenuProps>();
</script>

<template>
  <MuboxDropdownMenu :menus="menus" :modal="false">
    <div
      class="flex-center hover:bg-muted hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-2 text-lg font-semibold"
    >
      <ChevronDown class="size-4" />
    </div>
  </MuboxDropdownMenu>
</template>
