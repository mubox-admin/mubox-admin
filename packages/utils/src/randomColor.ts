/**
 * 生成随机颜色
 * @returns 颜色
 */
export function randomColor() {
  return `#${Math.floor(Math.random() * 0xFFFFFF)
    .toString(16)
    .padEnd(6, "0")}`;
}
