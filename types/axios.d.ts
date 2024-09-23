export type ErrorMessageMode = "none" | "modal" | "message" | undefined;
export type SuccessMessageMode = ErrorMessageMode;

export interface RequestOptions {
  /* ===== 请求配置 ===== */
  // 请求的服务器接口地址
  apiUrl?: string;
  // 接口前缀，一般可以用于后端微前端不同模块统一当前文件的接口前缀
  urlPrefix?: string;
  // 非GET请求的时候添加参数到url
  joinParamsToUrl?: boolean;
  // 是否自动格式化日期
  formatDate?: boolean;
  // GET接口是否加入时间戳（避免本地缓存）
  joinTime?: boolean;
  // 是否携带token
  withToken?: boolean;
  // 是否取消未完成重复请求
  cancelRepeatRequest?: boolean;
  // 请求重试机制
  retryRequest?: RetryRequest;
  /* ===== 响应配置 ===== */
  // 需要对返回数据进行处理
  isTransformResponse?: boolean;
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse?: boolean;
  // 当前接口成功提示（默认为 none）
  successMessageMode?: SuccessMessageMode;
  // 当前接口错误提示（默认为 message）
  errorMessageMode?: ErrorMessageMode;
}

export interface RetryRequest {
  // 是否开启重复请求
  isOpenRetry: boolean;
  // 请求重试次数
  count: number;
  // 重试间隔
  waitTime: number;
}

// TAG-MU 当前接口返回结构可能会有调整
export interface Result<T = any> {
  code: number;
  type: "success" | "error" | "warning";
  message: string;
  result: T;
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Recordable;
  // File parameter interface field name
  name?: string;
  // file name
  file: File | Blob;
  // file name
  filename?: string;
  [key: string]: any;
}
