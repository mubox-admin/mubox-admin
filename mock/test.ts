// 根据角色动态生成路由
import type { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/test",
    method: "post",
    response: () => {
      return {
        code: 0,
        success: true,
        result: {},
      };
    },
  },
] as MockMethod[];
