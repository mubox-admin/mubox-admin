import { clone } from "./clone";
import { isObject } from "./is";

/**
 * 对象值深度替换
 */
export function deepMerge<O extends Record<string, any>>(source: O, target: any) {
  target = clone(target);
  if (!isObject(target) || !isObject(source))
    return false;
  for (const prop in source) {
    if (!Object.prototype.hasOwnProperty.call(source, prop))
      continue;
    if (prop in target) {
      if (!isObject(target[prop])) {
        target[prop] = source[prop];
      }
      else {
        if (!isObject(source[prop])) {
          target[prop] = source[prop];
        }
        else {
          if (target[prop].concat && source[prop].concat)
            target[prop] = target[prop].concat(source[prop]);
          else
            target[prop] = deepMerge(target[prop], source[prop]);
        }
      }
    }
    else {
      target[prop] = source[prop];
    }
  }
  return target;
}

/**
 * 对象值深度替换
 */
export function deepReplace<O extends Record<string, any>>(source: O, obj: O) {
  for (const key in obj) {
    // 无当前值则跳过
    if (!source[key])
      continue;
    else if (isObject(source[key]))
      deepReplace(source[key], obj[key]);
    else
      source[key] = obj[key];
  }
  return source;
}
