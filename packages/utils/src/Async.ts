/*
  该文件提供部分函数异步化处理
*/

import { isPromise } from "./is";
import { fork } from "./Array";

interface WorkItemResult<K> {
  index: number;
  result: K;
  error: any;
};

export class AggregateError extends Error {
  errors: Error[];
  constructor(errors: Error[] = []) {
    super();
    const name = errors.find(e => e.name)?.name ?? "";
    this.name = `AggregateError(${name}...)`;
    this.message = `AggregateError with ${errors.length} errors`;
    this.stack = errors.find(e => e.stack)?.stack ?? this.stack;
    this.errors = errors;
  }
}

/**
 * 并发调用某一个异步函数，每次传入自定参数
 * @param limit 并发数
 * @param array 异步函数参数列表
 * @param func 异步函数
 */
export async function parallel<T, K>(limit: number, array: readonly T[], func: (item: T) => Promise<K>): Promise<K[]> {
  const work = array.map((item, index) => ({
    index,
    item,
  }));
  // Process array items
  const processor = async (resolve: (value: WorkItemResult<K>[]) => void) => {
    const results: WorkItemResult<K>[] = [];
    while (true) {
      const next = work.pop();
      if (!next)
        return resolve(results);
      const [error, result] = await tryIt(func)(next.item);
      results.push({
        error,
        result: result as K,
        index: next.index,
      });
    }
  };
  // Create queues
  const queues = Array.from({ length: limit }).map(() => new Promise(processor));
  // Wait for all queues to complete
  const itemResults = (await Promise.all(queues)) as WorkItemResult<K>[][];
  const [errors, results] = fork(
    itemResults.flat().sort((a, b) => a.index - b.index),
    x => !!x.error,
  );
  if (errors.length > 0)
    throw new AggregateError(errors.map(error => error.error));

  return results.map(r => r.result);
}

/**
 * 运行一个带有延迟函数的异步函数
 */
export async function defer<TResponse>(func: (
  register: (
    fn: (error?: any) => any,
    options?: { rethrow?: boolean }
  ) => void
) => Promise<TResponse>): Promise<TResponse> {
  const callbacks: {
    fn: (error?: any) => any;
    rethrow: boolean;
  }[] = [];
  const register = (
    fn: (error?: any) => any,
    options?: { rethrow?: boolean },
  ) =>
    callbacks.push({
      fn,
      rethrow: options?.rethrow ?? false,
    });
  const [err, response] = await tryIt(func)(register);
  for (const { fn, rethrow } of callbacks) {
    const [rethrown] = await tryIt(fn)(err);
    if (rethrown && rethrow)
      throw rethrown;
  }
  if (err)
    throw err;
  return response;
}

/**
 * 如果出错，让函数返回 undefined
 */
export function guard<TFunction extends () => any>(func: TFunction, shouldGuard?: (err: any) => boolean): ReturnType<TFunction> extends Promise<any>
  ? Promise<Awaited<ReturnType<TFunction>> | undefined>
  : ReturnType<TFunction> | undefined {
  const _guard = (err: any) => {
    if (shouldGuard && !shouldGuard(err))
      throw err;
    return undefined as any;
  };
  const isPromise = (result: any): result is Promise<any> =>
    result instanceof Promise;
  try {
    const result = func();
    return isPromise(result) ? result.catch(_guard) : result;
  }
  catch (err) {
    return _guard(err);
  }
}

type TryItReturn<Return> = Return extends Promise<any>
  ? Promise<[Error, undefined] | [undefined, Awaited<Return>]>
  : [Error, undefined] | [undefined, Return];

/**
 * try catch函数形式
 */
export function tryIt<Args extends any[], Return>(func: (...args: Args) => Return) {
  return (
    ...args: Args
  ): TryItReturn<Return> => {
    try {
      const result = func(...args);
      if (isPromise(result)) {
        return result
          .then(value => [undefined, value])
          .catch(err => [err, undefined]) as TryItReturn<Return>;
      }
      return [undefined, result] as TryItReturn<Return>;
    }
    catch (err) {
      return [err as any, undefined] as TryItReturn<Return>;
    }
  };
}
