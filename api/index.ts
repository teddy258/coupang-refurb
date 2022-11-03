import axios from "axios";
import { IItemModel, TItemType, TSortType } from "../types/item.interface";
import { buildQuery } from "../utils/utils";

export function getRefurbishedItems(type: TItemType, sort: TSortType = "PRICE", title?: string) {
  return axios
    .get<{ data: IItemModel[] }>(`https://api.oget.shop//api/v1/hoon/product/returnItem?${buildQuery({ type, sort, title })}`)
    .then((res) => res.data.data);
}
