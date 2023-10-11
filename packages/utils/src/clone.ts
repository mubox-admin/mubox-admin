// @ts-nocheck
import { isArray, isArrayBuffer, isDataView, isDate, isMap, isObject, isRegExp, isSet } from './is';

/**
 *深度克隆函数
 * @param x 值
 * @returns 克隆值
 */
export function clone<T>(x: T): T {
  if (typeof x !== 'object') return x;

  let k, tmp: T;

  if (isObject(x)) {
    if (x.constructor !== Object && typeof x.constructor === 'function') {
      tmp = new x.constructor();
      for (k in x) {
        if (Object.prototype.hasOwnProperty.call(x, k) && tmp[k] !== x[k]) {
          tmp[k] = clone(x[k]);
        }
      }
    } else {
      tmp = {}; // null
      for (k in x) {
        if (k === '__proto__') {
          Object.defineProperty(tmp, k, {
            value: clone(x[k]),
            configurable: true,
            enumerable: true,
            writable: true,
          });
        } else {
          tmp[k] = clone(x[k]);
        }
      }
    }
    return tmp;
  }

  if (isArray(x)) {
    k = x.length;
    for (tmp = Array.from({ length: k }); k--; ) {
      tmp[k] = clone(x[k]);
    }
    return tmp;
  }

  if (isSet(x)) {
    tmp = new Set();
    x.forEach((val) => {
      tmp.add(clone(val));
    });
    return tmp;
  }

  if (isMap(x)) {
    tmp = new Map();
    x.forEach((val, key) => {
      tmp.set(clone(key), clone(val));
    });
    return tmp;
  }

  if (isDate(x)) {
    return new Date(+x);
  }

  if (isRegExp(x)) {
    tmp = new RegExp(x.source, x.flags);
    tmp.lastIndex = x.lastIndex;
    return tmp;
  }

  if (isDataView(x)) {
    return new x.constructor(clone(x.buffer));
  }

  if (isArrayBuffer(x)) {
    return x.slice(0);
  }

  // ArrayBuffer.isView(x)
  // ~> `new` bcuz `Buffer.slice` => ref
  if (Object.prototype.toString.call(x).slice(-6) === 'Array]') {
    return new x.constructor(x);
  }

  return x;
}
