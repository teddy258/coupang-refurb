export enum EItemType {
  AIRPOT = "에어팟",
  WATCH = "애플워치",
  PHONE = "아이폰",
  MACBOOK = "맥북",
  PAD = "아이패드",
  MAC = "맥",
}

export type TItemType = keyof typeof EItemType;

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
}
