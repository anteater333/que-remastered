import { useUserProfileQuery } from "./queries/useWhoAmIQuery";
import { toast } from "react-toastify";
import { useLogoutMutation } from "./queries/useLogOutMutation";
import type { UserProfileType } from "../types/User";
import { QUE_USER_ROLE } from "../../shared/role";
import type { QueryObserverResult } from "@tanstack/react-query";

interface QueAuthType {
  isLoggedIn: boolean;
  isOwner: boolean;
  refetchProfile: () => Promise<QueryObserverResult<UserProfileType, Error>>;
  logout: () => Promise<void>;
  userProfile: UserProfileType;
}

/**
 * 로그인 한 사용자의 정보를 가져와 사용하는 훅
 */
export const useAuth = (): QueAuthType => {
  const { data, isError, refetch } = useUserProfileQuery();
  const { mutateAsync: requestLogout } = useLogoutMutation();

  const isLoggedIn = !isError && !!data?.email;
  const { email, handle, role, nickname, profilePictureUrl } = data ?? {
    email: "",
    handle: "",
    role: QUE_USER_ROLE.USER,
  };
  const isOwner = role === QUE_USER_ROLE.OWNER;

  const logout = async () => {
    try {
      await requestLogout();
      toast.success("로그아웃 되었습니다.");
    } catch (error) {}
  };

  return {
    isLoggedIn,
    isOwner,
    logout,
    refetchProfile: refetch,
    userProfile: {
      email: email,
      role: role,
      handle: handle,
      nickname: nickname,
      profilePictureUrl: profilePictureUrl,
    },
  };
};
