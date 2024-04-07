import type { RoleEnum } from "@/enums/RoleEnum";
import { http } from "@/utils/http";

export interface User {
  userInfo: UserInfo | null; // 角色信息
  roles: Array<RoleEnum>; // 当前登陆用户的角色
  accessToken: string; // token
}

export interface UserInfo {
  userId: string | number;
  username: string;
  avatar: string;
}

/** 登录 */
export function getLogin(data?: object) {
  return http.post<User>({ url: "/login", data });
}
