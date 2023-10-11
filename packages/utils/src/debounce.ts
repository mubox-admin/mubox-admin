/* eslint-disable no-undefined */

import { throttle } from './throttle';
interface debounceOptions {
  atBegin?: boolean;
}

/**
 * 函数防抖 保证函数仅在一系列调用的最开始或最后执行一次
 *
 * @param {Function} callback 被执行的函数
 * @param {number} delay 延迟多少秒后执行
 * @param {object} [options] 执行选项
 * @param {boolean} [options.atBegin] 默认为false,执行的时机是开始还是结束：开始则执行函数后，非重复触发的 `delay` ms后恢复，结束则在非重复触发的 `delay` ms后执行函数
 *
 * @returns {Function} A new, debounced function.
 */
export const debounce = (callback: Fn, delay = 200, options: debounceOptions = {}) => {
  const { atBegin = false } = options;
  return throttle(callback, delay, { debounceMode: atBegin !== false });
};
