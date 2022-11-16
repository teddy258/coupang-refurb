import { atom } from "jotai";
import { IUserPriceModifyModalProps } from "../types/common.interface";

export const userPriceModifyModalStore = atom({ open: false, userItem: null } as IUserPriceModifyModalProps);
