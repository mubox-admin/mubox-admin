<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@mubox-core/shadcn-ui';

interface Props {
  title: string;
}

defineOptions({
  name: 'AnalysisChartCard',
});

withDefaults(defineProps<Props>(), {});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-xl">
        {{ title }}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
  </Card>
</template>
