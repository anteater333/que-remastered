import APIInstance from "../lib/axios";

export interface WhoAmIResponse {
  email: string;
  nickname: string;
}

export const requestWhoAmI = async () => {
  return (await APIInstance.get<WhoAmIResponse>("/signin/whoami")).data;
};
