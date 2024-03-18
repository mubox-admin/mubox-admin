import defaultSetting from "@/config/projectSetting";
import { PROJECT_SETTING } from "@/enums/CacheEnum";

export const useSettingStore = createGlobalState(() => {
  // 系统配置
  const projectSetting = useLocalStorage(PROJECT_SETTING, defaultSetting);

  return {
    projectSetting,
  };
});
