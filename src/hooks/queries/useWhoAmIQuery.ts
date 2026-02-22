import { useQuery } from "@tanstack/react-query";
import { requestUserProfile } from "../../api";

export const QUERY_KEY_WHOAMI = ["whoami"];

/** 로그인 한 사용자 정보 조회 쿼리 */
export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY_WHOAMI,
    queryFn: requestUserProfile,
    retry: false,
  });
};
