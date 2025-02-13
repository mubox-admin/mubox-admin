/**
 * 将字符串的首字母大写
 * @param string
 */
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 将字符串的首字母转换为小写。
 *
 * @param str 要转换的字符串
 * @returns 首字母小写的字符串
 */
export function toLowerCaseFirstLetter(str: string): string {
  if (!str)
    return str; // 如果字符串为空，直接返回
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 *  生成驼峰命名法的键名
 * @param key
 * @param parentKey
 */
export function toCamelCase(key: string, parentKey: string): string {
  if (!parentKey) {
    return key;
  }
  return parentKey + key.charAt(0).toUpperCase() + key.slice(1);
}

export function kebabToCamelCase(str: string): string {
  return str
    .split('-')
    .filter(Boolean)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('');
}

/**
 * 数字格式化
 * @param num 数字
 * @returns 格式化后数字
 */
export function formatNumber(num: number) {
  // 无小数
  if (!num.toString().includes('.'))
    return num.toString().replace(/(?!^)(?=(\d{3})+$)/g, ',');
  // 有小数
  const arr = num.toString().split('.');
  // 整数部分
  arr[0] = arr[0].replace(/(?!^)(?=(\d{3})+$)/g, ',');
  // 小数部分
  const ceil = arr[1].split('');
  for (let i = 2; i < ceil.length; i += 3)
    ceil.splice(i, 1, `${ceil[i]},`);

  arr[1] = ceil.join('');
  return arr.join('.');
}
