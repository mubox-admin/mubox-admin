/*
  该文件提供部分浏览器常用函数
*/

interface deviceInter {
  match: Fn;
}

interface BrowserInter {
  browser?: string;
  version?: string;
}

// 检测设备类型(手机返回true,反之)
export function deviceDetection() {
  const sUserAgent: deviceInter = navigator.userAgent.toLowerCase();
  // const bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  const bIsIphoneOs = sUserAgent.match(/iphone os/i) === "iphone os";
  const bIsMidp = sUserAgent.match(/midp/i) === "midp";
  const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === "rv:1.2.3.4";
  const bIsUc = sUserAgent.match(/ucweb/i) === "ucweb";
  const bIsAndroid = sUserAgent.match(/android/i) === "android";
  const bIsCE = sUserAgent.match(/windows ce/i) === "windows ce";
  const bIsWM = sUserAgent.match(/windows mobile/i) === "windows mobile";
  return bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM;
}

// 获取浏览器型号以及版本
export function getBrowserInfo() {
  const ua = navigator.userAgent.toLowerCase();
  const re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
  const m = ua.match(re);
  const Sys: BrowserInter = {
    browser: m?.[1].replace(/version/, "'safari"),
    version: m?.[2],
  };

  return Sys;
}

// 打开超链接
export function openLink(link: string): void {
  const $a: HTMLElement = document.createElement("a");
  $a.setAttribute("href", link);
  $a.setAttribute("target", "_blank");
  $a.setAttribute("rel", "noreferrer noopener");
  $a.setAttribute("id", "external");
  const external = document.querySelector("#external");
  if (external)
    document.body.removeChild(external);
  document.body.appendChild($a);
  $a.click();
  $a.remove();
}
