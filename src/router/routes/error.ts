import type { RouteRecordRaw } from "vue-router";
import { BASIC_ROUTE, RANK } from "../enums";

export default {
  name: BASIC_ROUTE.ERROR,
  path: "/error",
  redirect: "/error/403",
  meta: {
    icon: "informationLine",
    title: "异常页面",
    // showLink: false,
    rank: RANK.ERROR,
  },
  children: [
    {
      name: BASIC_ROUTE.ERROR403,
      path: "/error/403",
      component: () => import("@/views/error/403.vue"),
      meta: {
        title: "403",
      },
    },
    {
      name: BASIC_ROUTE.ERROR404,
      path: "/error/404",
      component: () => import("@/views/error/404.vue"),
      meta: {
        title: "404",
      },
    },
    {
      name: BASIC_ROUTE.ERROR500,
      path: "/error/500",
      component: () => import("@/views/error/500.vue"),
      meta: {
        title: "500",
      },
    },
  ],
} as RouteRecordRaw;
