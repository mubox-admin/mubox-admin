export const enum BASIC_ROUTE {
  // 首页
  HOME = "HOME",
  WELCOME = "WELCOME",
  // 登录
  LOGIN = "LOGIN",
  // 重定向
  REDIRECT = "REDIRECT",
  // 异常
  ERROR = "ERROR",
  ERROR403 = "403",
  ERROR404 = "404",
  ERROR500 = "500",
}
// 路由白名单
export const enum WHITE_LIST {
  LOGIN = "/login",
}

export const enum RANK {
  HOME = 0,
  ERROR = 9,
  LOGIN = 101,
  LOADING = 102,
}
