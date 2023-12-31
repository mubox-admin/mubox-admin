import Axios from "axios";
import { stringify } from "qs";
import NProgress from "../progress";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CustomParamsSerializer,
  Method,
} from "axios";
import { formatToken, getToken } from "@/utils/auth";
import { useUserStore } from "@/store/user";

export type resultType = {
  accessToken?: string;
};

export type RequestMethods = Extract<
  Method,
  "get" | "post" | "put" | "delete" | "patch" | "option" | "head"
>;

export interface ResponseWrap<Response> {
  success: boolean;
  data: Response;
}

interface customOptions {
  unResolveData?: boolean;
}

export interface HttpError extends AxiosError {
  isCancelRequest?: boolean;
}

// interface PureHttp {
//   request<T>(
//     method: RequestMethods,
//     url: string,
//     param?: AxiosRequestConfig,
//     axiosConfig?: AxiosRequestConfig,
//   ): Promise<T>;
//   post<T, P>(url: string, params?: T, config?: AxiosRequestConfig): Promise<P>;
//   get<T, P>(url: string, params?: T, config?: AxiosRequestConfig): Promise<P>;
// }

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
};

type RequestFn = (token: string) => void;

class Http {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** token过期后，暂存待执行的请求 */
  private static pendingRequests: RequestFn[] = [];

  /** 防止重复刷新token */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  // private static initConfig: AxiosRequestConfig = {};

  /** 保存当前Axios实例对象 */
  private axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  private static retryOriginalRequest(config: AxiosRequestConfig) {
    return new Promise((resolve) => {
      Http.pendingRequests.push((token: string) => {
        if (config.headers) config.headers["Authorization"] = formatToken(token);
        resolve(config);
      });
    });
  }

  /** [√]请求拦截 */
  private httpInterceptorsRequest(): void {
    this.axiosInstance.interceptors.request.use(
      async (config: AxiosRequestConfig): Promise<any> => {
        // 开启进度条动画
        NProgress.start();
        // [x]下面两个没看懂,可能是自己加了一个额外的回调函数
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        // if (typeof config.beforeRequestCallback === "function") {
        //   config.beforeRequestCallback(config);
        //   return config;
        // }
        // if (Http.initConfig.beforeRequestCallback) {
        //   Http.initConfig.beforeRequestCallback(config);
        //   return config;
        // }
        /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
        const whiteList = ["/refreshToken", "/login"];
        return config.url && whiteList.includes(config.url)
          ? config
          : new Promise((resolve) => {
              const data = getToken();
              if (data) {
                const now = Date.now(); //这里可以用Date.now()
                const expired = Number.parseInt(`${data.expires}`) - now <= 0;
                if (expired) {
                  if (!Http.isRefreshing) {
                    Http.isRefreshing = true;
                    // token过期刷新
                    useUserStore()
                      .handRefreshToken({ refreshToken: data.refreshToken })
                      .then((res) => {
                        const token = res.accessToken;
                        if (config.headers) config.headers["Authorization"] = formatToken(token);
                        Http.pendingRequests.forEach((cb) => cb(token));
                        Http.pendingRequests = [];
                      })
                      .finally(() => {
                        Http.isRefreshing = false;
                      });
                  }
                  resolve(Http.retryOriginalRequest(config));
                } else {
                  if (config.headers)
                    config.headers["Authorization"] = formatToken(data.accessToken);
                  resolve(config);
                }
              } else {
                resolve(config);
              }
            });
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  /** [√]响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = this.axiosInstance;
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 关闭进度条动画
        NProgress.done();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        return response;
      },
      (error: HttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      },
    );
  }

  /** [√]通用请求工具函数 */
  public request<Response>(
    method: RequestMethods,
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<Response>;
  public request<Response>(
    method: RequestMethods,
    url: string,
    params?: any,
    config?: { unResolveData?: false } & AxiosRequestConfig,
  ): Promise<Response>;
  public request<Response>(
    method: RequestMethods,
    url: string,
    params?: any,
    config?: { unResolveData?: true } & AxiosRequestConfig,
  ): Promise<ResponseWrap<Response>>;
  public request<Response>(
    method: RequestMethods,
    url: string,
    params?: any,
    config?: customOptions & AxiosRequestConfig,
  ): Promise<Response | ResponseWrap<Response>> {
    const axiosConfig = {
      method,
      url,
      ...config,
    } as AxiosRequestConfig;
    method === "get"
      ? Object.assign(axiosConfig, { params })
      : Object.assign(axiosConfig, { data: params });

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(axiosConfig)
        .then((response) => {
          config?.unResolveData ? resolve(response.data) : resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /** [√]单独抽离的post工具函数 */
  public post<Response>(
    url: string,
    data?: AxiosRequestConfig,
    config?: { unResolveData?: false } & AxiosRequestConfig,
  ): Promise<Response>;
  public post<Response>(
    url: string,
    data?: AxiosRequestConfig,
    config?: { unResolveData?: true } & AxiosRequestConfig,
  ): Promise<ResponseWrap<Response>>;
  public post<Response>(
    url: string,
    data?: AxiosRequestConfig,
    config?: customOptions & AxiosRequestConfig,
  ): Promise<Response | ResponseWrap<Response>> {
    return this.request<Response>("post", url, data, config);
  }

  /** [√]单独抽离的get工具函数 */
  public get<Response>(
    url: string,
    params?: AxiosRequestConfig,
    config?: { unResolveData?: false } & AxiosRequestConfig,
  ): Promise<Response>;
  public get<Response>(
    url: string,
    params?: AxiosRequestConfig,
    config?: { unResolveData?: true } & AxiosRequestConfig,
  ): Promise<ResponseWrap<Response>>;
  public get<Response>(
    url: string,
    params?: AxiosRequestConfig,
    config?: customOptions & AxiosRequestConfig,
  ): Promise<Response | ResponseWrap<Response>> {
    return this.request<Response>("get", url, params, config);
  }
}

export const http = new Http();
