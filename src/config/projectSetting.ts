import type { ProjectSetting } from "#/config";

const defaultSetting: ProjectSetting = {
  version: "0.0.1",
  title: "Mubox-Admin",
  keepAlive: true,
  locale: "zh",
  darkMode: false,
  ADThemeColor: "#409EFF",
  cachingAsyncRoutes: false,
  sideBarSetting: {
    showLogo: true,
    collapsed: false,
  },
  tabsSetting: {
    cache: false,
    show: true,
  },
};

export default defaultSetting;
