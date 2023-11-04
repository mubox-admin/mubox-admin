import type { MockMethod } from "vite-plugin-mock";

const systemRouter = {
  path: "/system",
  meta: {
    icon: "SettingOutlined",
    title: "系统配置",
    rank: 12,
  },
  children: [
    {
      path: "/system/user/index",
      name: "User",
      meta: {
        icon: "AppleOutlined",
        title: "用户",
        roles: ["admin"],
      },
    },
    {
      path: "/system/role/index",
      name: "Role",
      meta: {
        icon: "WindowsOutlined",
        title: "角色",
        roles: ["admin"],
      },
    },
    {
      path: "/system/dept/index",
      name: "Dept",
      meta: {
        icon: "IeOutlined",
        title: "啥东西",
        roles: ["admin"],
      },
    },
  ],
};

export default [
  {
    url: "/getAsyncRoutes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [systemRouter],
      };
    },
  },
] as MockMethod[];
