import { useEffect } from "react";
import { useUserProfileQuery } from "./queries/useWhoAmIQuery";
import { toast } from "react-toastify";
import { useLogoutMutation } from "./queries/useLogOutMutation";
import type { UserProfileType } from "../types/User";

interface AuthProps {
  isLoggedIn: boolean;
  logout: () => void;
  userProfile: UserProfileType;
}

/**
 * 로그인 한 사용자의 정보를 가져와 사용하는 훅
 */
export const useAuth = (): AuthProps => {
  const { data, isError } = useUserProfileQuery();
  const { mutateAsync: requestLogout } = useLogoutMutation();

  const isLoggedIn = !isError && !!data?.email;
  const { email, nickname, profilePictureUrl } = data ?? {
    email: "",
  };

  const logout = async () => {
    try {
      await requestLogout();
      toast.success("로그아웃 되었습니다.");
    } catch (error) {}
  };

  return {
    isLoggedIn,
    logout,
    userProfile: {
      email: email,
      nickname: nickname,
      profilePictureUrl: profilePictureUrl,
    },
  };
};
