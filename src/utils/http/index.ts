// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import { clone, deepReplace } from "@mubox/utils";
import { MuAxios } from "./Axios";
import { transform } from "./axiosTransform";
import type { CreateAxiosOptions } from "./axiosTransform";
import { ContentTypeEnum } from "@/enums/HttpEnum";

const apiUrl = import.meta.env.API_URL ?? "";
const urlPrefix = import.meta.env.URL_PREFIX ?? "";

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new MuAxios(
    // 深度合并
    deepReplace(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: "",
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { "Content-Type": ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖(点击可跳转至定义文件中查看作用)
        requestOptions: {
          apiUrl,
          urlPrefix,
          joinParamsToUrl: false,
          isReturnNativeResponse: false,
          isTransformResponse: true,
          formatDate: true,
          errorMessageMode: "message",
          joinTime: true,
          cancelRepeatRequest: true,
          withToken: true,
          retryRequest: {
            isOpenRetry: true,
            count: 5,
            waitTime: 100,
          },
        },
      },
      opt || {},
    ),
  );
}
export const http = createAxios();

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//     urlPrefix: 'xxx',
//   },
// });
