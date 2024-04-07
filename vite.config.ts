import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import { pluginList } from "./build/plugins";
import { exclude, include } from "./build/optimize";

const root: string = process.cwd();
/** 路径查找 */
function pathResolve(dir: string): string {
  return resolve(__dirname, ".", dir);
}

const alias: Record<string, string> = {
  "@": pathResolve("src"),
  "@build": pathResolve("build"),
};

export default defineConfig(({ command, mode }) => {
  const { VITE_PORT } = loadEnv(mode, root);

  return {
    resolve: {
      alias,
    },
    optimizeDeps: {
      include,
      exclude,
    },
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: +VITE_PORT,
      host: "0.0.0.0",
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {},
    },
    build: {
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("index.html"),
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
    },
    plugins: pluginList(command),
  };
});
