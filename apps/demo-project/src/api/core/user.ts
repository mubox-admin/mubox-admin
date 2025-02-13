import type { UserInfo } from '@mubox/types';

import { requestClient } from '#/api/request';
import { interfaceMockResult, MOCK_USERS } from '../mock';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return interfaceMockResult(MOCK_USERS[0]);
  return requestClient.get<UserInfo>('/user/info');
}
