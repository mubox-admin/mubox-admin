import { clone } from "./clone";

/**
 * 对象属性批量赋值（将对象2的属性值赋值给对象1（若对象1中有该属性））
 * 常用于接口接收数据赋值给响应式数据
 * @param {*} passive 被赋值对象
 * @param {*} assignment 赋值对象
 * @param {*} shallow 赋值保留对引用值的引用
 * @returns void
 */
export function batchAttributeAssignment(
  passive: Record<string, unknown>,
  assignment: Record<string, unknown>,
  shallow = false,
) {
  if (passive === null || assignment === null) return;
  if (typeof passive !== "object" || typeof assignment !== "object") return;
  const assignmentArr = Object.keys(assignment);
  for (const key in passive) {
    if (assignmentArr.includes(key)) {
      shallow ? (passive[key] = assignment[key]) : (passive[key] = clone(assignment[key]));
    }
  }
}
