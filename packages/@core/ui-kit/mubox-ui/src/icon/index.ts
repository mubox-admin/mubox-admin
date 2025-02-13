/*
本系统使用图标的方式主要有以下几种方式
组件类：lucide-vue-next库直接引入组件图标；静态vue组件（写入svg代码）直接导入使用
Iconify：图标名称字符串识别
原生img标签渲染：本地静态svg文件引入用img标签渲染；远端url引入用img渲染
 */
// MuboxIcon主要针对动态方式，不确定图标具体为组件、链接还是Iconify时使用
export { default as MuboxIcon } from './icon.vue';
