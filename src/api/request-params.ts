import { RoleEnum } from "./rest-api";

export interface LoginParams {
  role: RoleEnum;
  username: string;
  password: string;
  rememberMe: boolean;
  verificationCode?: string;
}

export const bigPage = {
  current: 1,
  size: 999999
};
