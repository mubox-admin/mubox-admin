import { createSharedComposable } from '@vueuse/core';

import { computed, ref } from 'vue';

import { getMessages, type Locale } from './messages';

export const useSimpleLocale = createSharedComposable(() => {
  const currentLocale = ref<Locale>('zh-CN');

  const setSimpleLocale = (locale: Locale) => {
    currentLocale.value = locale;
  };

  const $st = computed(() => {
    const localeMessages = getMessages(currentLocale.value);
    return (key: string) => {
      return localeMessages[key] || key;
    };
  });
  return {
    $st,
    currentLocale,
    setSimpleLocale,
  };
});
