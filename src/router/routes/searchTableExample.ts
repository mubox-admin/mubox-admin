import type { RouteRecordRaw } from "vue-router";

export default {
  path: "/example",
  meta: {
    icon: "AlbumsOutline",
    title: "示例",
    rank: 12,
  },
  children: [
    {
      path: "/searchTableExample",
      name: "SearchTableExample",
      component: () => import("@/views/example/searchTable/index.vue"),
      meta: {
        icon: "Search",
        title: "查询表格页",
        roles: ["admin"],
        keepAlive: true,
      },
    },
  ],
} as RouteRecordRaw; ;
