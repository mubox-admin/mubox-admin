import { isObject, isString } from "@mubox/utils";
import { dialog, message } from "../discreteApi";
import type { ErrorMessageMode, SuccessMessageMode } from "#/axios";
import { i18n } from "@/locales";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export function joinTimestamp<T extends boolean>(
  join: boolean,
  restful: T
): T extends true ? string : object;

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join)
    return restful ? "" : {};

  const now = Date.now();
  if (restful)
    return `?_t=${now}`;

  return { _t: now };
}

/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params: Record<string, any>) {
  if (!isObject(params))
    return;

  for (const key in params) {
    const format = params[key]?.format ?? null;
    if (format && typeof format === "function")
      params[key] = params[key].format(DATE_TIME_FORMAT);

    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        }
        catch (error: any) {
          throw new Error(error);
        }
      }
    }
    if (isObject(params[key]))
      formatRequestDate(params[key]);
  }
}

// 成功提示
export function successFeedback(
  successMsg: string,
  successMessageMode: SuccessMessageMode = "none",
) {
  // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
  const { t } = i18n.global;
  // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
  if (successMessageMode === "modal")
    dialog.success({ title: t("sys.api.successTip"), content: successMsg });
  else if (successMessageMode === "message")
    message.success(successMsg);
}

// 错误提示
export function errorFeedback(
  errMessage: string,
  errorMessageMode: ErrorMessageMode = "message",
) {
  const { t } = i18n.global;
  if (errorMessageMode === "modal")
    dialog.error({ title: t("sys.api.errorTip"), content: errMessage });
  else if (errorMessageMode === "message")
    message.error(errMessage);
}
