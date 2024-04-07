export function intersection(arr1: any[], arr2: any[]) {
  const set = new Set();

  arr1.forEach((item) => {
    set.add(item);
  });

  return [...new Set(arr2.filter(item => set.has(item)))];
}
