import { useEffect } from "react";
import { useWhoAmIQuery } from "./queries/useWhoAmIQuery";
import { toast } from "react-toastify";
import { useLogoutMutation } from "./queries/useLogOutMutation";

/**
 * 로그인 한 사용자의 정보를 가져와 사용하는 훅
 */
export const useAuth = () => {
  const { data, isError, error } = useWhoAmIQuery();
  const { mutateAsync: requestLogout } = useLogoutMutation();
  const { email, nickname } = data ?? { email: undefined, nickname: undefined };

  const isLoggedIn = !!email;

  /**
   * 로그인이 만료되었음을 감지하는 Effect
   */
  useEffect(() => {
    if (isError) {
      toast.error("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
      console.error(error);
      requestLogout();
    }
  }, [isError, error]);

  return {
    isLoggedIn,
    email,
    nickname,
  };
};
