import type { RouteRecordRaw } from "vue-router";

export default {
  path: "/system",
  meta: {
    icon: "SettingsOutline",
    title: "测试页面",
    rank: 12,
  },
  children: [
    {
      path: "/test",
      name: "Test",
      component: () => import("@/views/test/index.vue"),
      meta: {
        icon: "LogoApple",
        title: "测试1",
        roles: ["admin"],
        keepAlive: true,
      },
    },
    {
      path: "/test2",
      name: "Test2",
      component: () => import("@/views/test/index.vue"),
      meta: {
        icon: "LogoWindows",
        title: "测试2",
        roles: ["admin"],
      },
    },
    {
      path: "/test3",
      name: "Test3",
      component: () => import("@/views/test/index.vue"),
      meta: {
        icon: "AirplaneOutline",
        title: "测试3",
        roles: ["admin"],
      },
    },
  ],
} as RouteRecordRaw; ;
