import { useQuery } from "@tanstack/react-query";
import { requestWhoAmI } from "../../api";

/** 로그인 한 사용자 정보 조회 쿼리 */
export const useWhoAmIQuery = () => {
  return useQuery({
    queryKey: ["whoami"],
    queryFn: requestWhoAmI,
    retry: false,
  });
};
