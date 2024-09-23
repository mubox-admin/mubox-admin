/**
 * Data processing class, can be configured according to the project
 */
import axios from "axios";
import { isAllEmpty, isString, setObjToUrlParams } from "@mubox/utils";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { checkCustomStatus, checkHttpStatus } from "./checkStatus";
import { errorFeedback, formatRequestDate, joinTimestamp, successFeedback } from "./helper";
import { AxiosRetry } from "./axiosRetry";
import type { RequestOptions, Result } from "#/axios";
import { RequestEnum, ResultEnum } from "@/enums/HttpEnum";
import { useUserStore } from "@/store/user";
import { i18n } from "@/locales";

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string;
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
}

export abstract class AxiosTransform {
  /**
   * A function that is called before a request is sent. It can modify the request configuration as needed.
   * 在发送请求之前调用的函数。它可以根据需要修改请求配置。
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;

  /**
   * @description: 处理响应数据
   */
  transformResponseHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any;

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (
    config: InternalAxiosRequestConfig,
    options: CreateAxiosOptions,
  ) => InternalAxiosRequestConfig;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (axiosInstance: AxiosInstance, error: Error) => void;
}

/**
 * @description: 数据处理，方便区分多种处理方式
 */
export const transform: AxiosTransform = {
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { t } = i18n.global;
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse)
      return res;

    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse)
      return res.data;

    // 错误的时候返回

    const { data } = res;
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error(t("sys.api.apiRequestFailed"));
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, result, message } = data;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && Reflect.has(data, "code") && code === ResultEnum.SUCCESS;
    if (hasSuccess) {
      let successMsg = message;

      if (isAllEmpty(successMsg))
        successMsg = t(`sys.api.operationSuccess`);

      successFeedback(successMsg, options.successMessageMode);

      return result;
    }
    // 处理业务响应错误码
    checkCustomStatus(code, message);
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    if (urlPrefix && isString(urlPrefix))
      config.url = `${urlPrefix}${config.url}`;

    if (apiUrl && isString(apiUrl))
      config.url = `${apiUrl}${config.url}`;

    const params = config.params || {};
    const data = config.data || false;
    if (formatDate && data && !isString(data))
      formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      }
      else {
        // 兼容restful风格
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    }
    else {
      if (!isString(params)) {
        if (formatDate)
          formatRequestDate(params);
        if (
          Reflect.has(config, "data")
          && config.data
          && (Object.keys(config.data).length > 0 || config.data instanceof FormData)
        ) {
          config.data = data;
          config.params = params;
        }
        else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      }
      else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    const { token } = useUserStore();
    if (token.value && (config as Record<string, any>)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Record<string, any>).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token.value}`
        : token.value;
    }
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    const { t } = i18n.global;
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || "none";
    const msg: string = response?.data?.error?.message ?? "";
    const err: string = error?.toString?.() ?? "";
    let errMessage = "";

    if (axios.isCancel(error))
      return Promise.reject(error);

    try {
      if (code === "ECONNABORTED" && message.includes("timeout"))
        errMessage = t("sys.api.apiTimeoutMessage");

      if (err?.includes("Network Error"))
        errMessage = t("sys.api.networkExceptionMsg");

      if (code === "ERR_CANCELED")
        errMessage = t("sys.api.apiTimeoutMessage");

      if (errMessage) {
        errorFeedback(errMessage, errorMessageMode);
        return Promise.reject(error);
      }
    }
    catch (error) {
      throw new Error(error as unknown as string);
    }

    checkHttpStatus(error?.response?.status, msg, errorMessageMode);

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config.requestOptions.retryRequest;
    if (config.method?.toUpperCase() === RequestEnum.GET && isOpenRetry)
      retryRequest.retry(axiosInstance, error);
    return Promise.reject(error);
  },
};
