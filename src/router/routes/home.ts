const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "home-filled",
    title: "首页",
    rank: 0,
    // showLink: false,
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: "欢迎页",
        showLink: VITE_HIDE_HOME === "true" ? false : true,
        keepAlive: true,
      },
    },
    {
      path: "/testP",
      name: "TestP",
      meta: {
        title: "测试页",
      },
      children: [
        {
          path: "/test",
          name: "Test",
          component: () => import("@/views/test/index.vue"),
          meta: {
            title: "测试页2",
            keepAlive: true,
          },
        },
      ],
    },
  ],
} as RouteConfigsTable;
