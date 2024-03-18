import { StorageSerializers } from "@vueuse/core";
import type { User, UserInfo } from "@/api/user";
import type { RoleEnum } from "@/enums/RoleEnum";
import { getLogin } from "@/api/user";
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from "@/enums/CacheEnum";
import router, { resetRouter } from "@/router";
import { initRoutes, useTabsStore } from "@/store/tabs";
import { BASIC_ROUTE } from "@/router/enums";

export const useUserStore = createGlobalState(() => {
  const userInfo = useLocalStorage<UserInfo | null>(USER_INFO_KEY, null, {
    serializer: StorageSerializers.object,
  });
  const token = useLocalStorage<string>(TOKEN_KEY, "");
  const roles = useLocalStorage<RoleEnum[]>(ROLES_KEY, []);

  /** 登入 */
  async function loginByUsername(username: string, password: string) {
    return new Promise<User>((resolve, reject) => {
      getLogin({ username, password })
        .then((res) => {
          userInfo.value = res.userInfo;
          token.value = res.accessToken;
          roles.value = res.roles;
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  /** [√]前端登出（不调用接口） */
  function logout() {
    userInfo.value = null;
    roles.value = [];
    token.value = "";
    useTabsStore().equalTabs(initRoutes);
    resetRouter();
    router.push({ name: BASIC_ROUTE.LOGIN });
  }
  return {
    userInfo,
    token,
    roles,
    loginByUsername,
    logout,
  };
});
