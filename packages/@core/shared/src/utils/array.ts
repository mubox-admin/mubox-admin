/*
  该文件提供部分数组常用函数
*/

// 返回两个数组的交集
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  const set = new Set();

  arr1.forEach((item) => {
    set.add(item);
  });

  return [...new Set(arr2.filter(item => set.has(item)))];
}

// 将数组中的元素按指定条件分组
export function fork<T>(list: readonly T[], condition: (item: T) => boolean): [T[], T[]] {
  if (!list)
    return [[], []];
  return list.reduce(
    (acc, item): [T[], T[]] => {
      const [a, b] = acc;
      if (condition(item))
        return [[...a, item], b];
      else
        return [a, [...b, item]];
    },
    [[], []] as [T[], T[]],
  );
}

/**
 * 将others中与root相同的元素覆盖root
 *
 * cover(gods, newGods, (f) => f.name); // => [{name: "Zeus" power: 100}, {name: "Ra", power: 97}]
 */
export function cover<T>(root: readonly T[], others: readonly T[], matcher: (item: T) => any) {
  if (!others && !root)
    return [];
  if (!others)
    return root;
  if (!root)
    return [];
  if (!matcher)
    return root;
  return root.reduce((acc, r) => {
    const matched = others.find(o => matcher(r) === matcher(o));
    if (matched)
      acc.push(matched);
    else acc.push(r);
    return acc;
  }, [] as T[]);
}

/**
 * 根据指定字段对对象数组进行去重
 * @param arr 要去重的对象数组
 * @param key 去重依据的字段名
 * @returns 去重后的对象数组
 */
export function uniqueByField<T>(arr: T[], key: keyof T): T[] {
  const seen = new Map<any, T>();
  return arr.filter((item) => {
    const value = item[key];
    return seen.has(value) ? false : (seen.set(value, item), true);
  });
}
