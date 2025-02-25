import { isWindowsOs } from './is';

const unit = ['B', 'KB', 'MB', 'GB', 'TB'];
/**
 * 根据系统格式化文件大小
 * @param bytes 字节大小
 * @param precision 保留位数/精度
 */
export default function fileCarry(bytes: number, precision = 2) {
  const carry = isWindowsOs() ? 1024 : 1000;
  let index = 0;
  if (bytes < carry)
    return `${bytes}B`;
  while (bytes >= carry) {
    bytes /= carry;
    index++;
    if (index === 4)
      break;
  }
  return bytes.toFixed(precision) + unit[index];
}
