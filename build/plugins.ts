import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import svgLoader from "vite-svg-loader";
import { viteMockServe } from "vite-plugin-mock";
import vueJsx from "@vitejs/plugin-vue-jsx";

export function pluginList(command: string) {
  return [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
    UnoCSS(),
    // 自动导入模块
    AutoImport({
      imports: ["vue", "@vueuse/core"],
      resolvers: [AntDesignVueResolver()],
      dts: "./types/auto-imports.d.ts",
    }),
    // 自动导入组件
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],
      dts: "./types/auto-components.d.ts",
    }),
    // svg组件化支持
    svgLoader(),
    vueJsx(),
    // mock支持
    viteMockServe({
      mockPath: "mock",
      enable: command === "serve",
      logger: false,
    }),
  ];
}
