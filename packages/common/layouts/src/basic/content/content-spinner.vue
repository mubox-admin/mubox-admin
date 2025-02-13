<script lang="ts" setup>
import { MuboxSpinner } from '@mubox-core/mubox-ui';

import { useContentSpinner } from './use-content-spinner';

defineOptions({ name: 'LayoutContentSpinner' });

const { spinning } = useContentSpinner();
</script>

<template>
  <MuboxSpinner :spinning="spinning" />
</template>
