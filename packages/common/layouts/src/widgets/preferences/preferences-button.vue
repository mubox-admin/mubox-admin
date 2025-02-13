<script lang="ts" setup>
import { MuboxIconButton } from '@mubox-core/mubox-ui';

import { Settings } from 'lucide-vue-next';

import Preferences from './preferences.vue';

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}
</script>

<template>
  <Preferences @clear-preferences-and-logout="clearPreferencesAndLogout">
    <MuboxIconButton>
      <Settings class="text-foreground size-4" />
    </MuboxIconButton>
  </Preferences>
</template>
