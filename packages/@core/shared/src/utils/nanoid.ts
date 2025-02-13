// https://github.com/ai/nanoid/blob/main/README.zh-CN.md
/**
 * 返回一个唯一标识符
 */
export function nanoid(t = 21) {
  return crypto
    .getRandomValues(new Uint8Array(t))
    .reduce(
      (t, e) =>
        (t
          // eslint-disable-next-line no-cond-assign
          += (e &= 63) < 36
            ? e.toString(36)
            : e < 62
              ? (e - 26).toString(36).toUpperCase()
              : e > 62
                ? '-'
                : '_'),
      '',
    );
}
