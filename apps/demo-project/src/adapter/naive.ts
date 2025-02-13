import { preferences } from '@mubox/preferences';
import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui';
import { computed } from 'vue';

import '@mubox/styles';

const themeOverridesProviderProps = computed(() => ({
  themeOverrides: preferences.theme.mode === 'light' ? lightTheme : darkTheme,
}));

const themeProviderProps = computed(() => ({
  theme: preferences.theme.mode === 'light' ? lightTheme : darkTheme,
}));

export const { dialog, loadingBar, message, modal, notification }
  = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
    {
      configProviderProps: themeProviderProps,
      loadingBarProviderProps: themeOverridesProviderProps,
      messageProviderProps: themeOverridesProviderProps,
      notificationProviderProps: themeOverridesProviderProps,
    },
  );
