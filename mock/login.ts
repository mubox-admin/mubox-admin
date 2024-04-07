// 根据角色动态生成路由
import type { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/login",
    method: "post",
    response: ({ body }) => {
      if (body.username === "admin") {
        return {
          code: 0,
          success: true,
          result: {
            userInfo: {
              username: "木",
              avatar: "https://avatars.githubusercontent.com/u/98245255?v=4",
              userId: "123",
            },
            // 一个用户可能有多个角色
            roles: ["admin"],
            accessToken: "eyJhbGciOiJIUzUxMiJ9.admin",
          },
        };
      }
      else {
        return {
          success: true,
          data: {
            username: "common",
            // 一个用户可能有多个角色
            roles: ["common"],
            accessToken: "eyJhbGciOiJIUzUxMiJ9.common",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.commonRefresh",
            expires: "2023/10/30 00:00:00",
          },
        };
      }
    },
  },
] as MockMethod[];
