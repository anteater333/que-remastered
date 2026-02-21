import { useQuery } from "@tanstack/react-query";
import { requestWhoAmI } from "../../api";

export const QUERY_KEY_WHOAMI = ["whoami"];

/** 로그인 한 사용자 정보 조회 쿼리 */
export const useWhoAmIQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY_WHOAMI,
    queryFn: requestWhoAmI,
    retry: false,
  });
};
