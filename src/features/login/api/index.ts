import APIInstance from "../../../lib/axios";

export interface LoginResponse {}

export const requestLogin = async (email: string, password: string) => {
  return (await APIInstance.post<LoginResponse>("/signin", { email, password }))
    .data;
};
