// 通用查询请求参数
declare interface SearchPageDataQuery<Condition> {
  condition: Partial<Condition>;
  current: number;
  size: number;
}

// 通用查询响应参数
declare interface SearchPageDataResult<Records> {
  records: Records[];
  total: number;
  size: number;
  current: number;
  searchCount: boolean;
  pages: number;
}
