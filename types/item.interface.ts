export enum EItemType {
  PHONE = "아이폰",
  PAD = "아이패드",
  WATCH = "애플워치",
  MACBOOK = "맥북",
  AIRPOT = "에어팟",
  MAC = "맥",
}

export enum ESortType {
  PRICE = "저가순",
  SALE = "할인율순",
  NAME = "이름순",
}

export type TItemType = keyof typeof EItemType;
export type TSortType = keyof typeof ESortType;
export interface IItemModel {
  name: string;
  detail: string;
  price: number;
  originPrice: number;
  danawaPrice: number;
  cardInfo: string;
  cardPrice: number;
  image: string;
  url: string;
  sale: number;
}

export interface ICategoryModel {
  id: string;
  name: string;
  displayName: string;
  depth: number;
  parentId: string;
}

export interface IUserItemModel {
  id: number;
  name: string;
  price: number;
  originPrice: number;
  cardInfo: string;
  cardPrice: number;
  image: string;
  sale: number;
  url: string;
  userPrice: number;
  soldOut: boolean;
}
