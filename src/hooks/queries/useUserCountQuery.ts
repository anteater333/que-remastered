import { useQuery } from "@tanstack/react-query";
import { requestUserCount } from "../../api";

export const QUERY_KEY_USER_COUNT = ["userCount"];

/** 서비스 전체 회원 수 조회 쿼리 */
export const useUserCountQuery = (enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEY_USER_COUNT,
    queryFn: requestUserCount,
    enabled,
  });
};
