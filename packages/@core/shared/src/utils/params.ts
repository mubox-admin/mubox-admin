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
export function getParam(key: string, url: string) {
  const r = new RegExp(`(\\?|#|&)${key}=([^&#]*)(&|#|$)`);
  const m = url || location.href.match(r);
  return decodeURI(!m ? '' : m[2]);
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj)
    parameters += `${key}=${encodeURIComponent(obj[key])}&`;

  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}
