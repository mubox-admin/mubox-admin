const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined';
}

export function isUndefined<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isObject(val: any): val is Record<any, any> {
  return is(val, 'Object');
}

export function isDate(val: unknown): val is Date {
  return is(val, 'Date');
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number');
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export function isString(val: unknown): val is string {
  return is(val, 'String');
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean');
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map');
}

export function isSet(val: unknown): val is Set<any> {
  return is(val, 'Set');
}

export function isDataView(val: unknown): val is DataView {
  return is(val, 'DataView');
}

export function isArrayBuffer(val: unknown): val is ArrayBuffer {
  return is(val, 'ArrayBuffer');
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp');
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

/**
 * 检查传入的值是否为空。
 *
 * 以下情况将被认为是空：
 * - 值为null。
 * - 值为undefined。
 * - 值为一个空字符串。
 * - 值为一个长度为0的数组。
 * - 值为一个没有元素的Map或Set。
 * - 值为一个没有属性的对象。
 *
 * @param {T} value 要检查的值。
 * @returns {boolean} 如果值为空，返回true，否则返回false。
 */
export function isEmpty<T = unknown>(value?: T): value is T {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value) || isString(value)) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
}

export function isJson(val: any) {
  return isArray(val) || isObject(val);
}

/**
 * Returns the first value in the provided list that is neither `null` nor `undefined`.
 *
 * This function iterates over the input values and returns the first one that is
 * not strictly equal to `null` or `undefined`. If all values are either `null` or
 * `undefined`, it returns `undefined`.
 *
 * @template T - The type of the input values.
 * @param {...(T | null | undefined)[]} values - A list of values to evaluate.
 * @returns {T | undefined} - The first value that is not `null` or `undefined`, or `undefined` if none are found.
 *
 * @example
 * // Returns 42 because it is the first non-null, non-undefined value.
 * getFirstNonNullOrUndefined(undefined, null, 42, 'hello'); // 42
 *
 * @example
 * // Returns 'hello' because it is the first non-null, non-undefined value.
 * getFirstNonNullOrUndefined(null, undefined, 'hello', 123); // 'hello'
 *
 * @example
 * // Returns undefined because all values are either null or undefined.
 * getFirstNonNullOrUndefined(undefined, null); // undefined
 */
export function getFirstNonNullOrUndefined<T>(
  ...values: (null | T | undefined)[]
): T | undefined {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUndefined(val) && isNull(val);
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUndefined(val) || isNull(val);
}

/** 判断俩值是否相等，支持数组、对象、基本类型 */
export function isEqual(value1: unknown, value2: unknown): boolean {
  // 基本类型
  if (value1 === value2)
    return true;
  // NaN
  if (Number.isNaN(value1) && Number.isNaN(value2))
    return true;
  // 数组或者对象
  if ((isObject(value1) && isObject(value2)) || (isArray(value1) && isArray(value2)))
    return JSON.stringify(value1) === JSON.stringify(value2);
  return false;
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window');
}

export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName;
}

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;

/** url链接正则 */
export function isUrl(value: string): boolean {
  const reg
    = /^(?:(?:ht|f)tps?:\/\/)?(?:[^!@#$%^&*?.\s-][^!@#$%^&*?.\s]{0,64}\.)+[a-z]{2,6}\/?/;
  return reg.test(value);
}

/** 手机号码正则 */
export function isPhone(value: string): boolean {
  const reg
    = /^1(?:3\d|4[0,14-9]|5[0-3,5-9]|6[2,567]|7[0-8]|8\d|9[0-3,5-9])\d{8}$/;
  return reg.test(value);
}

/** 邮箱正则 */
export function isEmail(value: string): boolean {
  const reg = /^[A-Z0-9\u4E00-\u9FA5]+@[\w-]+(?:\.[\w-]+)+$/i;
  return reg.test(value);
}

/**
 * 检查当前运行环境是否为Mac OS。
 *
 * 这个函数通过检查navigator.userAgent字符串来判断当前运行环境。
 * 如果userAgent字符串中包含"macintosh"或"mac os x"（不区分大小写），则认为当前环境是Mac OS。
 *
 * @returns {boolean} 如果当前环境是Mac OS，返回true，否则返回false。
 */
export function isMacOs(): boolean {
  const macRegex = /macintosh|mac os x/i;
  return macRegex.test(navigator.userAgent);
}

/**
 * 检查当前运行环境是否为Windows OS。
 *
 * 这个函数通过检查navigator.userAgent字符串来判断当前运行环境。
 * 如果userAgent字符串中包含"windows"或"win32"（不区分大小写），则认为当前环境是Windows OS。
 *
 * @returns {boolean} 如果当前环境是Windows OS，返回true，否则返回false。
 */
export function isWindowsOs(): boolean {
  const windowsRegex = /windows|win32/i;
  return windowsRegex.test(navigator.userAgent);
}

/**
 * 检查传入的字符串是否为有效的HTTP或HTTPS URL。
 *
 * @param {string} url 要检查的字符串。
 * @return {boolean} 如果字符串是有效的HTTP或HTTPS URL，返回true，否则返回false。
 */
export function isHttpUrl(url?: string): boolean {
  if (!url) {
    return false;
  }
  // 使用正则表达式测试URL是否以http:// 或 https:// 开头
  const httpRegex = /^https?:\/\/.*$/;
  return httpRegex.test(url);
}
/**
 * 判断文件路径
 * 如：/assets/images/logo.png
 */
export function isFileUrl(url?: string): boolean {
  if (!url) {
    return false;
  }
  const fileUrlRegex = /^\/[\w-]+(?:\/[\w-]+)*\/[\w-]+(?:\.[\w-]+)*\.[a-z]{3,4}$/i;
  return fileUrlRegex.test(url);
}
/**
 * 判断base64图片格式
 */
export function isBase64(url?: string): boolean {
  if (!url) {
    return false;
  }
  const fileUrlRegex = /^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?,.+/i;
  return fileUrlRegex.test(url);
}
