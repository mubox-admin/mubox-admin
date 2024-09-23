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
  if (!parentKey)
    return key;

  return parentKey + key.charAt(0).toUpperCase() + key.slice(1);
}
