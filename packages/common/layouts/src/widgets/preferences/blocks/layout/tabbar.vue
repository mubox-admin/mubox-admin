<script setup lang="ts">
import type { SelectOption } from '@mubox/types';

import { $t } from '@mubox/locales';

import { computed } from 'vue';

import SelectItem from '../select-item.vue';
import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceTabsConfig',
});

defineProps<{ disabled?: boolean }>();

const tabbarEnable = defineModel<boolean>('tabbarEnable');
const tabbarShowIcon = defineModel<boolean>('tabbarShowIcon');
const tabbarPersist = defineModel<boolean>('tabbarPersist');
const tabbarDraggable = defineModel<boolean>('tabbarDraggable');
const tabbarWheelable = defineModel<boolean>('tabbarWheelable');
const tabbarStyleType = defineModel<string>('tabbarStyleType');
const tabbarShowMore = defineModel<boolean>('tabbarShowMore');
const tabbarShowMaximize = defineModel<boolean>('tabbarShowMaximize');

const styleItems = computed((): SelectOption[] => [
  {
    label: $t('preferences.tabbar.styleType.chrome'),
    value: 'chrome',
  },
  {
    label: $t('preferences.tabbar.styleType.plain'),
    value: 'plain',
  },
  {
    label: $t('preferences.tabbar.styleType.card'),
    value: 'card',
  },

  {
    label: $t('preferences.tabbar.styleType.brisk'),
    value: 'brisk',
  },
]);
</script>

<template>
  <SwitchItem v-model="tabbarEnable" :disabled="disabled">
    {{ $t('preferences.tabbar.enable') }}
  </SwitchItem>
  <SwitchItem v-model="tabbarPersist" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.persist') }}
  </SwitchItem>
  <SwitchItem v-model="tabbarDraggable" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.draggable') }}
  </SwitchItem>
  <SwitchItem
    v-model="tabbarWheelable"
    :disabled="!tabbarEnable"
    :tip="$t('preferences.tabbar.wheelableTip')"
  >
    {{ $t('preferences.tabbar.wheelable') }}
  </SwitchItem>
  <SwitchItem v-model="tabbarShowIcon" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.icon') }}
  </SwitchItem>
  <SwitchItem v-model="tabbarShowMore" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.showMore') }}
  </SwitchItem>
  <SwitchItem v-model="tabbarShowMaximize" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.showMaximize') }}
  </SwitchItem>
  <SelectItem v-model="tabbarStyleType" :items="styleItems">
    {{ $t('preferences.tabbar.styleType.title') }}
  </SelectItem>
</template>
