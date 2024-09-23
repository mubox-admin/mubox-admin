export interface ProjectSetting {
  // 版本号
  version: string;
  // 系统名称
  title: string;
  // 国际化
  locale: "zh" | "en";
  // 是否开启暗黑模式
  darkMode: boolean;
  // 侧边栏设置
  sideBarSetting: {
    // 是否展示logo
    showLogo: boolean;
    // 侧边栏展开 | 收起
    collapsed: boolean;
  };
  tabsSetting: {
    // 隐藏标签
    show: boolean;
    // 开启标签缓存
    cache: boolean;
  };
  // 开启页面缓存
  // MARK-MU 当前缓存的页签路由name应与组件name一致
  keepAlive: boolean;
  // ant-design主题色
  ADThemeColor: string;
  // 缓存远程路由
  cachingAsyncRoutes: boolean;
  // 切换页面时是否移除未完成的请求
  removeAllHttpPending: boolean;
}
