import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from 'unocss/vite'
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { viteMockServe } from "vite-plugin-mock";

/** 路径查找 */
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

const alias: Record<string, string> = {
  "@": pathResolve("src"),
  "@build": pathResolve("build"),
};

export default defineConfig(({ command }) => {
  return {
    resolve: {
      alias,
    },
    plugins: [
      vue({
        script: {
          defineModel: true,
          propsDestructure: true,
        },
      }),
      UnoCSS(),
      // 自动导入模块
      AutoImport({
        imports: ["vue"],
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
      // mock支持
      viteMockServe({
        mockPath: "mock",
        enable: command === "serve",
        logger: false,
      }),
      
    ],
  };
});
