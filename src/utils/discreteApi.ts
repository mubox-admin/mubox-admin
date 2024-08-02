/* setup组件外使用的全局组件API */
import { type ConfigProviderProps, createDiscreteApi, darkTheme, lightTheme } from "naive-ui";

const isDark = useDark({ disableTransition: false });

const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: isDark.value ? darkTheme : lightTheme,
}));
const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
  ["message", "dialog", "notification", "loadingBar", "modal"],
  {
    configProviderProps: configProviderPropsRef,
  },
);
export { message, notification, dialog, loadingBar, modal };
