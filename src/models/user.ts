import { atom } from "jotai";

// 用户信息
export const userInfoState = atom<LoginUser | undefined>(undefined);