import { BASIC_ROUTE, RANK, WHITE_LIST } from "../enums";
import type { RouteRecordRaw } from "vue-router";
const Layout = () => import("@/layout/index.vue");

const LoginRoute: RouteRecordRaw = {
  name: BASIC_ROUTE.LOGIN,
  path: WHITE_LIST.LOGIN,
  component: () => import("@/views/login/index.vue"),
  meta: {
    title: "登录",
    showLink: false,
    rank: RANK.LOGIN,
  },
};

const RedirectRoute: RouteRecordRaw = {
  name: BASIC_ROUTE.REDIRECT,
  path: "/redirect",
  component: Layout,
  meta: {
    title: "加载中...",
    showLink: false,
    rank: RANK.LOADING,
  },
  children: [
    {
      path: "/redirect/:path(.*)",
      name: "Redirect",
      component: () => import("@/layout/redirect.vue"),
    },
  ],
};

export default [LoginRoute, RedirectRoute] as RouteRecordRaw[];
