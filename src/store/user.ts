import { storageSession } from "@mubox/utils";
import type { RefreshToken, User } from "@/api/user";
import type { ResponseWrap } from "@/utils/http";
import { type DataInfo, removeToken, sessionKey, setToken } from "@/utils/auth";
import { getLogin, refreshTokenApi } from "@/api/user";
import router, { resetRouter } from "@/router";
import { initRoutes, useTagsStore } from "@/store/tags";

export const useUserStore = createGlobalState(() => {
  // 用户名
  const username = ref(storageSession.getItem<DataInfo<number>>(sessionKey)?.username ?? ""); // 页面级别权限
  const roles = ref(storageSession.getItem<DataInfo<number>>(sessionKey)?.roles ?? []);
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
  /** 存储登录页面显示哪个组件 */
  function SET_CURRENT_PAGE(value: number) {
    currentPage.value = value;
  }
  /** 登入 */
  async function loginByUsername(username: string, password: string) {
    return new Promise<ResponseWrap<User>>((resolve, reject) => {
      getLogin({ username, password })
        .then((res) => {
          if (res) {
            setToken(res.data);
            resolve(res);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  /** [√]前端登出（不调用接口） */
  function logout() {
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
    currentPage,
    SET_USERNAME,
    SET_ROLES,
    SET_CURRENT_PAGE,
    loginByUsername,
    logout,
    handRefreshToken,
  };
});
