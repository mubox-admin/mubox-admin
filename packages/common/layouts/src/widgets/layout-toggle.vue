<script setup lang="ts">
import type { MuboxDropdownMenuItem } from '@mubox-core/mubox-ui';

import type { AuthPageLayoutType } from '@mubox/types';

import { MuboxDropdownRadioMenu, MuboxIconButton } from '@mubox-core/mubox-ui';

import {
  preferences,
  updatePreferences,
  usePreferences,
} from '@mubox-core/preferences';
import { $t } from '@mubox/locales';
import { InspectionPanel, PanelLeft, PanelRight } from 'lucide-vue-next';

import { computed } from 'vue';

defineOptions({
  name: 'AuthenticationLayoutToggle',
});

const menus = computed((): MuboxDropdownMenuItem[] => [
  {
    icon: PanelLeft,
    label: $t('authentication.layout.alignLeft'),
    value: 'panel-left',
  },
  {
    icon: InspectionPanel,
    label: $t('authentication.layout.center'),
    value: 'panel-center',
  },
  {
    icon: PanelRight,
    label: $t('authentication.layout.alignRight'),
    value: 'panel-right',
  },
]);

const { authPanelCenter, authPanelLeft, authPanelRight } = usePreferences();

function handleUpdate(value: string) {
  updatePreferences({
    app: {
      authPageLayout: value as AuthPageLayoutType,
    },
  });
}
</script>

<template>
  <MuboxDropdownRadioMenu
    :menus="menus"
    :model-value="preferences.app.authPageLayout"
    @update:model-value="handleUpdate"
  >
    <MuboxIconButton>
      <PanelRight v-if="authPanelRight" class="size-4" />
      <PanelLeft v-if="authPanelLeft" class="size-4" />
      <InspectionPanel v-if="authPanelCenter" class="size-4" />
    </MuboxIconButton>
  </MuboxDropdownRadioMenu>
</template>
