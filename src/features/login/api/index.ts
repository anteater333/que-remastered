import APIInstance from "../../../lib/axios";

export interface LoginResponse {}

export const requestLogin = async (email: string, password: string) => {
  return (await APIInstance.post<LoginResponse>("/login", { email, password }))
    .data;
};
