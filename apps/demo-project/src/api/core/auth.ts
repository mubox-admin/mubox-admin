import { baseRequestClient, requestClient } from '#/api/request';
import { interfaceMockResult } from '../mock';

/** 登录接口参数 */
export interface LoginParams {
  password?: string;
  username?: string;
}

/** 登录接口返回值 */
export interface LoginResult {
  accessToken: string;
}

/**
 * 登录
 */
export async function loginApi(data: LoginParams) {
  return interfaceMockResult({
    accessToken: 'this is token',
  });
  return requestClient.post<LoginResult>('/auth/login', data);
}

export interface RefreshTokenResult {
  data: string;
  status: number;
}
/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return interfaceMockResult({
    status: 0,
    data: 'this is token',
  });
  return baseRequestClient.post<RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return interfaceMockResult(null);
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return interfaceMockResult(['1', '2', '3']);
  return requestClient.get<string[]>('/auth/codes');
}
