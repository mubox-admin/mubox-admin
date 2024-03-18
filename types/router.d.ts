// 全局路由类型声明

import { type RouteLocationNormalized } from "vue-router";

declare global {
  /**
   * 路由跳转类型声明
   */
  interface ToRouteType extends RouteLocationNormalized {
    meta: CustomizeRouteMeta;
  }

  /**
   * @description 路由自定义附加字段
   */
  interface RouteExtendConfigs {
    // 路由唯一标识
    id?: number;
    // 路由父级id
    parentId?: number | null;
    // id路径数组
    pathList?: number[];
    // 路由排序
    rank?: number;
  }

  /**
   * @description 完整子路由的`meta`配置表
   */
  interface CustomizeRouteMeta {
    /** 菜单名称（兼容国际化、非国际化，如何用国际化的写法就必须在根目录的`locales`文件夹下对应添加） `必填` */
    title: string;
    /** 菜单图标 `可选` */
    icon?: string | FunctionalComponent | IconifyIcon;
    /** 是否在菜单中显示（默认`true`）`可选` */
    showLink?: boolean;
    /** 页面级别权限设置，配置当前页面路由可以由数组中哪些角色可以访问，非数组中的角色会被拦截并跳转至403页面 `可选` */
    roles?: Array<string>;
    /** 按钮级别权限设置 `可选` */
    auths?: Array<string>;
    /** 路由组件缓存（开启 `true`、关闭 `false`）`可选` */
    keepAlive?: boolean;
    /** 内嵌的`iframe`链接 `可选` */
    frameSrc?: string;
    /** `iframe`页是否开启首次加载动画（默认`true`）`可选` */
    frameLoading?: boolean;
    // 是否不添加信息到标签页，（默认`false`）
    hiddenTab?: boolean;
    /** 动态路由可打开的最大数量 `可选` */
    dynamicLevel?: number;
    /** 菜单升序排序，值越高排的越后（只针对顶级路由）`可选` */
    rank?: number;
  }
}

// https://router.vuejs.org/zh/guide/advanced/meta.html#typescript
declare module "vue-router" {
  // 路由自定义字段添加到路由对象中
  interface _RouteRecordBase extends RouteExtendConfigs {}
  interface RouteRecordNormalized extends RouteExtendConfigs {}
  // 路由自定义meta参数添加到路由中
  interface RouteMeta extends CustomizeRouteMeta {}
}
