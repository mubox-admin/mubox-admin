import { isBoolean, isEqual, isUrl, storageLocal } from "@mubox/utils";
import type { RouteRecordRaw } from "vue-router";
import { responsiveStorageNameSpace } from "@/config";
import router from "@/router";

export type Tag = {
  query?: any;
  params?: any;
} & RouteConfigsTable;

const { VITE_HIDE_HOME } = import.meta.env;
// 常驻路由,关闭 multiTagsCache时使用
export const initRoutes: Tag[] =
  VITE_HIDE_HOME === "false"
    ? [
        // {
        //   name: "Welcome",
        //   path: "/welcome",
        //   meta: {
        //     // MU-TODO i18n
        //     title: "首页",
        //     icon: "homeFilled",
        //   },
        // },
      ]
    : [];

export const useTagsStore = createGlobalState(() => {
  const currentTab = ref<string>();
  const tagList = ref(
    storageLocal.getItem<StorageConfigs>(`${responsiveStorageNameSpace()}configure`)?.multiTagsCache
      ? storageLocal.getItem<Tag[]>(`${responsiveStorageNameSpace()}tags`)
      : [...initRoutes],
  );
  // 点击菜单项时或者点击搜索登情况，添加Tag标签
  function addTag(routeName: string): void {
    const hasValue = tagList.value.some((item) => {
      return item.path === routeName;
    });
    function concatRoute(route: readonly RouteRecordRaw[], value: string) {
      if (!hasValue) {
        route.forEach((routeItem) => {
          if (routeItem.name === value) {
            pushTags({
              path: routeItem.path,
              name: routeItem.name as string,
              meta: routeItem.meta,
            });
          } else {
            if (routeItem.children && routeItem.children.length > 0) {
              concatRoute(routeItem.children, value);
            }
          }
        });
      }
    }
    concatRoute(router.options.routes, routeName);
  }

  function equalTags(tags: Tag[]) {
    tagList.value = tags;
    tagsCache(tagList.value);
  }
  function pushTags(tag: Tag) {
    // 不添加到标签页
    if (tag?.meta?.hiddenTag) return;
    // 如果是外链无需添加信息到标签页
    if (isUrl(tag?.name)) return;
    // 如果title为空拒绝添加空信息到标签页
    if (tag?.meta?.title.length === 0) return;
    // showLink:false 不添加到标签页
    if (isBoolean(tag?.meta?.showLink) && !tag?.meta?.showLink) return;

    // 判断tag是否已存在
    const tagHasExits = tagList.value.some((item) => {
      return item.path === tag.path;
    });
    // 判断tag中的query键值是否相等
    const tagQueryHasExits = tagList.value.some((item) => {
      return isEqual(item?.query, tag?.query);
    });
    // 判断tag中的params键值是否相等
    const tagParamsHasExits = tagList.value.some((item) => {
      return isEqual(item?.params, tag?.params);
    });
    if (tagHasExits && tagQueryHasExits && tagParamsHasExits) return;

    // 动态路由可打开的最大数量
    const dynamicLevel = tag?.meta?.dynamicLevel ?? -1;
    if (dynamicLevel > 0) {
      if (tagList.value.filter((e) => e?.path === tag.path).length >= dynamicLevel) {
        // 如果当前已打开的动态路由数大于dynamicLevel，替换第一个动态路由标签
        const index = tagList.value.findIndex((item) => item?.path === tag.path);
        index !== -1 && tagList.value.splice(index, 1);
      }
    }
    tagList.value.push(tag);
    tagsCache(tagList.value);
  }
  function spliceTags(
    // Tag路径
    routeName: string,
    position?: { startIndex: number; length?: number },
  ) {
    if (!routeName) throw new Error("当前路由未添加name，请添加name后重试");
    if (!position) {
      const index = tagList.value.findIndex((v) => v.name === routeName);

      if (index === -1) return;
      tagList.value.splice(index, 1);
    } else {
      tagList.value.splice(position?.startIndex, position?.length);
    }
    tagsCache(tagList.value);
    return tagList.value;
  }
  const sliceTags = () => {
    return tagList.value.slice(-1);
  };

  // 是否启用Tag本地缓存
  const tagListCache = ref(
    storageLocal.getItem<StorageConfigs>(`${responsiveStorageNameSpace()}configure`)
      ?.multiTagsCache,
  );
  function TagsListCacheChange(multiTagsCache_: boolean) {
    tagListCache.value = multiTagsCache_;
    if (tagListCache.value) {
      storageLocal.setItem(`${responsiveStorageNameSpace()}tags`, tagList.value);
    } else {
      storageLocal.removeItem(`${responsiveStorageNameSpace()}tags`);
    }
  }
  function tagsCache(tags: Tag[]) {
    tagListCache.value && storageLocal.setItem(`${responsiveStorageNameSpace()}tags`, tags);
  }
  return {
    currentTab,
    tagList,
    tagListCache,
    TagsListCacheChange,
    tagsCache,
    addTag,
    equalTags,
    pushTags,
    spliceTags,
    sliceTags,
  };
});
