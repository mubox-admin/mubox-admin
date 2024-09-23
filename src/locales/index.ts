import { createI18n } from "vue-i18n";
import { enUS, zhCN } from "naive-ui";
import zh from "./lang/zh.json";
import en from "./lang/en.json";
import { useSettingStore } from "@/store/setting";

// naive-ui语言包
export const localeMap = {
  zh: zhCN,
  en: enUS,
};

export const i18n = createI18n({
  legacy: false,
  locale: useSettingStore().projectSetting.value.locale,
  fallbackLocale: "en",
  messages: {
    zh,
    en,
  },
});
