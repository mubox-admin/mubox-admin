import { createI18n } from "vue-i18n";
import zh from "./lang/zh.json";
import en from "./lang/en.json";
import { useSettingStore } from "@/store/setting";

export const i18n = createI18n({
  legacy: false,
  locale: useSettingStore().projectSetting.value.locale,
  fallbackLocale: "en",
  messages: {
    zh,
    en,
  },
});
