/** 查询规则分页数据 */
import { http } from "@/utils/http";

export interface Condition {
  categoryType: string;
  color: string;
  itemCode: string;
  itemName: string;
  locationCode: string;
  mgtDate: string;
  storageCondition: string;
}

export interface InventoryDataRecord {
  id: number;
  locationCode: number;
  itemCode: string;
  mgtDate: Date;
  onHandQty: number;
  createTime: Date;
  modifyTime: Date;
  ruleCode: string;
  itemName: string;
  categoryType: CategoryType;
  storageCondition: StorageCondition;
  color: Color;
  volume: number;
}

export enum CategoryType {
  化妆品 = "化妆品",
  药品 = "药品",
  鞋服 = "鞋服",
}

export enum Color {
  Green = "green",
  Normal = "normal",
  Yellow = "yellow",
}

export enum StorageCondition {
  常温 = "常温",
}

export function fetchInventoryPageData(params: SearchPageDataQuery<Condition>) {
  return http.post<SearchPageDataResult<InventoryDataRecord>>({
    url: "/invInventory/page",
    params,
  });
}

/** 导入库存 */
export function fetchInventoryImport(file: File) {
  return http.uploadFile({
    url: `/api/invInventory/upload`,
  }, {
    name: "fileKeyName",
    file,
  });
}
