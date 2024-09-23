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

// 比较两个数组是否相等
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length)
    return false;
  const counter = new Map<T, number>();
  for (const value of a)
    counter.set(value, (counter.get(value) || 0) + 1);

  for (const value of b) {
    const count = counter.get(value);
    if (count === undefined || count === 0)
      return false;

    counter.set(value, count - 1);
  }
  return true;
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
 * 从数组中删除重复项
 *
 * unique(fish, (f) => f.name);
 */
export function unique<T, K extends string | number | symbol>(
  array: readonly T[],
  toKey?: (item: T) => K,
): T[] {
  const valueMap = array.reduce((acc, item) => {
    const key = toKey ? toKey(item) : (item as any as string | number | symbol);
    if (acc[key])
      return acc;
    acc[key] = item;
    return acc;
  }, {} as Record<string | number | symbol, T>);
  return Object.values(valueMap);
}
