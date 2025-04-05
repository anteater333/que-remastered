import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectIsSigned, selectCurrentUser } from "../reducers/authReducer";

/**
 * 현재 로그인 한 사용자의 정보를 가져옵니다.
 * @returns
 */
export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isSigned = useSelector(selectIsSigned);

  return useMemo(() => ({ user, isSigned }), [user, isSigned]);
};
