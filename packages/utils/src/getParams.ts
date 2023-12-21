/**
 * 解析url中的params
 * @param url url
 * @returns 解析后参数
 */
export function getParamsMap(url: string) {
  const reg = /([^?&=]+)=([^&]+)/g;
  const paramsMap: Record<string, string | number> = {};
  const match = [...url.matchAll(reg)];
  match.forEach(([, k, v]) => {
    Object.assign(paramsMap, { [k]: Number.isNaN(+v) ? v : +v });
  });
  return paramsMap;
}

/**
 * 解析url中的某个参数
 * @param key 某个参数
 * @param url url
 * @returns 解析后参数
 */
export const getParam = (key: string, url: string) => {
  const r = new RegExp(`(\\?|#|&)${key}=([^&#]*)(&|#|$)`);
  const m = url || location.href.match(r);
  return decodeURI(!m ? "" : m[2]);
};
