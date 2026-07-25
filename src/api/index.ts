import APIInstance from "../lib/axios";
import type { UserProfileType } from "../types/User";

export const requestUserProfile = async () => {
  return (await APIInstance.get<{ user: UserProfileType }>("/users/me")).data
    .user;
};

export const requestLogOut = async () => {
  return await APIInstance.post("/signin/signout");
};

export const requestUserCount = async () => {
  return (await APIInstance.get<{ count: number }>("/users/count")).data
    .count;
};
