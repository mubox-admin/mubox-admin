const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== "undefined";
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isObject(val: any): val is Record<any, any> {
  return is(val, "Object");
}

export function isDate(val: unknown): val is Date {
  return is(val, "Date");
}

export function isNumber(val: unknown): val is number {
  return is(val, "Number");
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, "Promise") && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export function isString(val: unknown): val is string {
  return is(val, "String");
}

export function isFunction(val: unknown): val is Function {
  return typeof val === "function";
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, "Boolean");
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, "Map");
}

export function isSet(val: unknown): val is Set<any> {
  return is(val, "Set");
}

export function isDataView(val: unknown): val is DataView {
  return is(val, "DataView");
}

export function isArrayBuffer(val: unknown): val is ArrayBuffer {
  return is(val, "ArrayBuffer");
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, "RegExp");
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

export function isJson(val: any) {
  return isArray(val) || isObject(val);
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val);
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

// 判断当前的数组、对象、Map、Set、string是否为空
export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val))
    return val.length === 0;

  if (val instanceof Map || val instanceof Set)
    return val.size === 0;

  if (isObject(val))
    return Object.keys(val).length === 0;

  return false;
}
// 判断当前是否为空，包括null 和 undefined
export function isAllEmpty<T = unknown>(val: T): val is T {
  return val === null || val === undefined || isEmpty(val);
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
  return typeof window !== "undefined" && is(val, "Window");
}

export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName;
}

export const isServer = typeof window === "undefined";

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
 * 判断是否为mac系统
 * @returns boolean
 */
export function isMac() {
  return navigator.userAgent.toLowerCase().includes("mac");
}
/**
 * 判断是否为win系统
 * @returns boolean
 */
export function isWin() {
  return navigator.userAgent.toLowerCase().includes("windows");
}
