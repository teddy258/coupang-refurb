import axios from "axios";
import { IPaginateWrapper } from "../types/common.interface";
import { ICategoryModel, IItemModel, IUserItemModel, TSortType } from "../types/item.interface";
import { buildQuery } from "../utils/utils";
import { API } from "./core";

type TGetRefurbishedItemListParams = {
  category: string;
  sort: TSortType;
  size: number;
  page: number;
  brand?: string;
  title?: string;
};
export async function getRefurbishedItemList(params: TGetRefurbishedItemListParams) {
  return API.get<IPaginateWrapper<IItemModel>>(`/api/v1/oget/products/${params.category}?${buildQuery(params)}`);
}

export function getCategories(brand?: string) {
  if (brand) return API.get<{ data: ICategoryModel[] }>(`/api/v1/oget/categories/${brand}`);
  else return API.get<{ data: ICategoryModel[] }>(`/api/v1/oget/categories`);
}

type TGetUserItemListParams = {
  chatId: string;
  page: number;
  size: number;
};
export function getUserItemList(params: TGetUserItemListParams) {
  return API.get<IPaginateWrapper<IUserItemModel>>(`/api/v1/oget/alarm/${params.chatId}?${buildQuery(params)}`);
}

type TModifyUserItemAlarmPriceParams = {
  chatId: string;
  pid: number;
  price: number;
};
export function modifyUserItemAlarmPrice(params: TModifyUserItemAlarmPriceParams) {
  return API.put<{ data: { result: boolean } }>(`/api/v1/oget/alarm/${params.chatId}`, params);
}

type TDeleteUserItemAlarmPriceParams = {
  chatId: string;
  pid: number;
};
export function deleteUserItemAlarmPrice(params: TDeleteUserItemAlarmPriceParams) {
  return API.delete<{ data: { result: boolean } }>(`/api/v1/oget/alarm/${params.chatId}/${params.pid}}`);
}
