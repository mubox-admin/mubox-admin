<script setup lang="ts">
import type { WorkbenchTrendItem } from '../typing';

import { MuboxIcon } from '@mubox-core/mubox-ui';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@mubox-core/shadcn-ui';

interface Props {
  items: WorkbenchTrendItem[];
  title: string;
}

defineOptions({
  name: 'WorkbenchTrends',
});

withDefaults(defineProps<Props>(), {
  items: () => [],
});
</script>

<template>
  <Card>
    <CardHeader class="py-4">
      <CardTitle class="text-lg">
        {{ title }}
      </CardTitle>
    </CardHeader>
    <CardContent class="flex flex-wrap p-5 pt-0">
      <ul class="divide-border w-full divide-y" role="list">
        <li
          v-for="item in items"
          :key="item.title"
          class="flex justify-between gap-x-6 py-5"
        >
          <div class="flex min-w-0 items-center gap-x-4">
            <MuboxIcon
              :icon="item.avatar"
              alt=""
              class="size-10 flex-none rounded-full"
            />
            <div class="min-w-0 flex-auto">
              <p class="text-foreground text-sm font-semibold leading-6">
                {{ item.title }}
              </p>
              <p
                class="text-foreground/80 *:text-primary mt-1 truncate text-xs leading-5"
                v-html="item.content"
              />
            </div>
          </div>
          <div class="hidden h-full shrink-0 sm:flex sm:flex-col sm:items-end">
            <span class="text-foreground/80 mt-6 text-xs leading-6">
              {{ item.date }}
            </span>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
