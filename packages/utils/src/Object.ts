import { clone } from "./clone";
import { isObject } from "./is";

/**
 * Pick a list of properties from an object
 * into a new object
 */
export function pick<T extends object, TKeys extends keyof T>(obj: T, keys: TKeys[]): Pick<T, TKeys> {
  if (!obj)
    return {} as Pick<T, TKeys>;
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key))
      acc[key] = obj[key];
    return acc;
  }, {} as Pick<T, TKeys>);
}

/**
 * Omit a list of properties from an object
 * returning a new object with the properties
 * that remain
 */
export function omit<T, TKeys extends keyof T>(obj: T, keys: TKeys[]): Omit<T, TKeys> {
  if (!obj)
    return {} as Omit<T, TKeys>;
  if (!keys || keys.length === 0)
    return obj as Omit<T, TKeys>;
  return keys.reduce(
    (acc, key) => {
      // Gross, I know, it's mutating the object, but we
      // are allowing it in this very limited scope due
      // to the performance implications of an omit func.
      // Not a pattern or practice to use elsewhere.
      delete acc[key];
      return acc;
    },
    { ...obj },
  );
}

/**
 * 对象值深度合并
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

/**
 * 计算对象的层数
 * @param obj 任意对象
 */
export function getObjectLevel(obj: Record<string, string>) {
  // 先判断第obj是否对象，是则默认层数1并且遍历递归比较每一个属性最深，类似二叉树深度
  let res = 0;
  if (typeof obj !== "object" || !obj)
    return;

  const computed = (obj: Record<string, string>, level = 1) => {
    Object.values(obj).forEach((value) => {
      if (typeof value === "object" && value !== null)
        computed(value, level + 1);
    });
    res = Math.max(res, level);
  };
  computed(obj);

  return res;
}

/**
 * 将对象按值进行排序
 * @param obj 传入对象
 * @param ascending 是否升序
 */
export function sortObjectKeys(obj: Record<string, number>, ascending: boolean = true) {
  return Object.keys(obj)
    .sort((a, b) => ascending ? obj[a] - obj[b] : obj[b] - obj[a])
    .reduce((previous, current) => {
      previous[current] = obj[current];
      return previous;
    }, {} as Record<string, number>);
}
