import { isBoolean, isEqual, isUrl, storageLocal } from "@mubox/utils";
import { responsiveStorageNameSpace } from "@/config";

export type Tag = {
  query?: any;
  params?: any;
} & RouteConfigsTable;

const { VITE_HIDE_HOME } = import.meta.env;
export const initRoutes: Tag[] =
  VITE_HIDE_HOME === "false"
    ? [
        {
          name: "Welcome",
          path: "/welcome",
          meta: {
            // MU-TODO i18n
            title: "首页",
            icon: "homeFilled",
          },
        },
      ]
    : [];

export const useTagsStore = createGlobalState(() => {
  const tagList = ref(
    storageLocal.getItem<StorageConfigs>(`${responsiveStorageNameSpace()}configure`)?.multiTagsCache
      ? storageLocal.getItem<Tag[]>(`${responsiveStorageNameSpace()}tags`)
      : [...initRoutes],
  );
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
    const tagHasExits = tagList.value.some((tag) => {
      return tag.path === tag.path;
    });
    // 判断tag中的query键值是否相等
    const tagQueryHasExits = tagList.value.some((tag) => {
      return isEqual(tag?.query, tag?.query);
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
    path: string,
    position = {
      startIndex: 0,
      length: 1,
    },
  ) {
    if (!position) {
      const index = tagList.value.findIndex((v) => v.path === path);
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
  return {
    tagList,
    tagListCache,
    TagsListCacheChange,
    tagsCache,
    equalTags,
    pushTags,
    spliceTags,
    sliceTags,
  };
});
