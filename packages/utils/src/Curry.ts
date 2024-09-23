/*
本篇收纳部分柯里化函数工具
柯里化即为高阶函数，使业务函数具备一定的高阶功能，诸如防抖、节流、缓存等
*/

interface ThrottleOptions {
  noTrailing?: boolean;
  noLeading?: boolean;
  debounceMode?: boolean;
}

/**
 * 限制函数的执行，对于限制速率特别有用在调整大小和滚动等事件上执行处理程序
 *
 * @param {Function} callback 一个在延迟`delay`毫秒后执行的函数，this 上下文和所有参数都通过传递，就像执行限制函数时的回调一样
 * @param {number} delay 对于事件回调设置防抖节流延迟，默认为200ms
 * @param {object} [options] 节流选项 - 节流相较于防抖的选项不同原因为：节流期间的函数执行可以保留到节流结束调用，保证一定安全性和平稳的节流，而防抖在防抖期间的每次调用都会刷新计时器并稳定调用最后一次函数，不会造成调用函数缺失，所以只需要决定函数调用时机即可
 * @param {boolean} [options.noTrailing] 默认为false，`delay`期间的函数调用会推迟到节流结束执行，如果设置为 true 则节流函数不会在节流结束时调用函数,
 * @param {boolean} [options.noLeading] 默认为false，如果设置为 true 则节流函数不会在节流开始时调用函数
 * @param {boolean} [options.debounceMode] 防抖模式-该选项由内置debounce函数使用，！！！勿通过throttle调用以免产生歧义
 *
 * @returns {Function} A new, throttled, function.
 */
export function throttle(callback: Fn, delay = 200, options: ThrottleOptions = {}) {
  const { noTrailing = false, noLeading = false, debounceMode = undefined } = options;
  // 包装器停止被调用后，此超时可确保在 `throttle` 和 `end debounce` 模式下的正确时间执行回调
  let timeoutID: ReturnType<typeof setTimeout> | undefined;
  let cancelled = false;

  // 跟踪上次执行回调的时间
  let lastExec = 0;

  // 清除现有超时的函数
  function clearExistingTimeout() {
    if (timeoutID)
      clearTimeout(timeoutID);
  }

  // 取消下一次执行的函数
  function cancel(options: { upcomingOnly: boolean }) {
    const { upcomingOnly = false } = options || {};
    clearExistingTimeout();
    cancelled = !upcomingOnly;
  }

  // 包装函数封装了所有的节流去抖动功能，并且在执行时将限制回调的执行速率
  function wrapper(this: Window | Node | Record<string, any>, ...arg: any) {
    const elapsed = Date.now() - lastExec;

    if (cancelled)
      return;

    // 执行回调并更新上次执行时间戳
    const exec = () => {
      lastExec = Date.now();
      callback.apply(this, arg);
    };

    // 如果`debounceMode`在开始时为 true，则用于清除标志以允许将来的回调执行
    const clear = () => {
      timeoutID = undefined;
    };

    if (!noLeading && debounceMode && !timeoutID)
      exec();

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      if (noLeading) {
        lastExec = Date.now();
        if (!noTrailing)
          timeoutID = setTimeout(debounceMode ? clear : exec, delay);
      }
      else {
        exec();
      }
    }
    else if (noTrailing !== true) {
      timeoutID = setTimeout(
        debounceMode ? clear : exec,
        debounceMode === undefined ? delay - elapsed : delay,
      );
    }
  }

  wrapper.cancel = cancel;

  return wrapper;
}

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
export function debounce(callback: Fn, delay = 200, options: debounceOptions = {}) {
  const { atBegin = false } = options;
  return throttle(callback, delay, { debounceMode: atBegin !== false });
}
