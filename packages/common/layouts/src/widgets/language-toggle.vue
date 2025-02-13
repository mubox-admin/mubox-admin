<script setup lang="ts">
import type { SupportedLanguagesType } from '@mubox/locales';

import { MuboxDropdownRadioMenu, MuboxIconButton } from '@mubox-core/mubox-ui';
import { preferences, updatePreferences } from '@mubox-core/preferences';
import { loadLocaleMessages, SUPPORT_LANGUAGES } from '@mubox/locales';

import { Languages } from 'lucide-vue-next';

defineOptions({
  name: 'LanguageToggle',
});

async function handleUpdate(value: string) {
  const locale = value as SupportedLanguagesType;
  updatePreferences({
    app: {
      locale,
    },
  });
  await loadLocaleMessages(locale);
}
</script>

<template>
  <div>
    <MuboxDropdownRadioMenu
      :menus="SUPPORT_LANGUAGES"
      :model-value="preferences.app.locale"
      @update:model-value="handleUpdate"
    >
      <MuboxIconButton>
        <Languages class="text-foreground size-4" />
      </MuboxIconButton>
    </MuboxDropdownRadioMenu>
  </div>
</template>
