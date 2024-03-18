import { BASIC_ROUTE, RANK } from "../enums";
import type { RouteRecordRaw } from "vue-router";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  name: BASIC_ROUTE.HOME,
  path: "/",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "home-filled",
    title: "首页",
    rank: RANK.HOME,
    // showLink: false,
  },
  children: [
    {
      name: BASIC_ROUTE.WELCOME,
      path: "/welcome",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: "欢迎页",
        showLink: !(VITE_HIDE_HOME === "true"),
        keepAlive: true,
        hiddenTab: true,
      },
    },
  ],
} as RouteRecordRaw;
