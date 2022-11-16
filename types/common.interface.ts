import { IUserItemModel } from "./item.interface";

export interface IPaginateWrapper<T> {
  data: T[];
  page: number;
  size: number;
  totalPage: number;
  totalCount: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

export interface IModalProps {
  open: boolean;
  onAfterSuccess?: () => void;
}

export interface IUserPriceModifyModalProps extends IModalProps {
  userItem: IUserItemModel;
  chatId: string;
}
