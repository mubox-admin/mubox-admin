import { errorFeedback } from "./helper";
import type { ErrorMessageMode } from "#/axios";
import { useUserStore } from "@/store/user";
import { ResultEnum } from "@/enums/HttpEnum";
import { i18n } from "@/locales";

// 服务器返回的HTTP CODE
export function checkHttpStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = "message",
): void {
  const { t } = i18n.global;
  const { logout } = useUserStore();
  let errMessage = "";

  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      logout();
      errMessage = msg || t("sys.api.errMsg401");
      break;
    case 403:
      errMessage = t("sys.api.errMsg403");
      break;
    // 404请求不存在
    case 404:
      errMessage = t("sys.api.errMsg404");
      break;
    case 405:
      errMessage = t("sys.api.errMsg405");
      break;
    case 408:
      errMessage = t("sys.api.errMsg408");
      break;
    case 500:
      errMessage = t("sys.api.errMsg500");
      break;
    case 501:
      errMessage = t("sys.api.errMsg501");
      break;
    case 502:
      errMessage = t("sys.api.errMsg502");
      break;
    case 503:
      errMessage = t("sys.api.errMsg503");
      break;
    case 504:
      errMessage = t("sys.api.errMsg504");
      break;
    case 505:
      errMessage = t("sys.api.errMsg505");
      break;
    default:
  }
  if (errMessage)
    errorFeedback(errMessage, errorMessageMode);
}

// 业务自定义CODE
export function checkCustomStatus(
  code: number,
  message: string,
  errorMessageMode: ErrorMessageMode = "message",
) {
  // 在此处根据自己项目的实际情况对不同的code执行不同的操作
  let errMessage = "";
  const { t } = i18n.global;
  const { logout } = useUserStore();
  switch (code) {
    case ResultEnum.TIMEOUT:
      errMessage = t("sys.api.timeoutMessage");
      logout();
      break;
    default:
      if (message)
        errMessage = message;
  }
  if (errMessage)
    errorFeedback(errMessage, errorMessageMode);

  // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
  throw new Error(errMessage || t("sys.api.apiRequestFailed"));
}
