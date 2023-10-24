import { createGlobalState } from "@vueuse/core";
import { storageSession } from "@mubox/utils";
import type { RefreshToken, User } from "@/api/user";
import { type DataInfo, removeToken, sessionKey, setToken } from "@/utils/auth";
import { getLogin, refreshTokenApi } from "@/api/user";
import router, { resetRouter } from "@/router";
import { initRoutes, useTagsStore } from "@/store/tags";

export interface userType {
  username?: string;
  roles?: Array<string>;
  verifyCode?: string;
  currentPage?: number;
}

export const useUserStore = createGlobalState(() => {
  // 用户名
  const username = ref(storageSession.getItem<DataInfo<number>>(sessionKey)?.username ?? ""); // 页面级别权限
  const roles = ref(storageSession.getItem<DataInfo<number>>(sessionKey)?.roles ?? []);
  // 前端生成的验证码（按实际需求替换）
  const verifyCode = ref("");
  // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
  const currentPage = ref(0);

  /** 存储用户名 */
  function SET_USERNAME(username_: string) {
    username.value = username_;
  }
  /** 存储角色 */
  function SET_ROLES(roles_: Array<string>) {
    roles.value = roles_;
  }
  /** 存储前端生成的验证码 */
  function SET_VERIFY_CODE(verifyCode_: string) {
    verifyCode.value = verifyCode_;
  }
  /** 存储登录页面显示哪个组件 */
  function SET_CURRENT_PAGE(value: number) {
    currentPage.value = value;
  }
  /** 登入 */
  async function loginByUsername(data) {
    return new Promise<User>((resolve, reject) => {
      getLogin(data)
        .then((data) => {
          if (data) {
            setToken(data);
            resolve(data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  /** [√]前端登出（不调用接口） */
  function logOut() {
    username.value = "";
    roles.value = [];
    removeToken();
    useTagsStore().equalTags(initRoutes);
    resetRouter();
    router.push("/login");
  }
  /** [√]刷新`token` */
  async function handRefreshToken(data) {
    return new Promise<RefreshToken>((resolve, reject) => {
      refreshTokenApi(data)
        .then((data) => {
          if (data) {
            setToken(data);
            resolve(data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  return {
    username,
    roles,
    verifyCode,
    currentPage,
    SET_USERNAME,
    SET_ROLES,
    SET_VERIFY_CODE,
    SET_CURRENT_PAGE,
    loginByUsername,
    logOut,
    handRefreshToken,
  };
});
