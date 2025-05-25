import { useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectIsSigned, selectCurrentUser } from "../reducers/authReducer";
import {
  addViewedUser,
  initializeNoticeList,
  selectNoticeList,
} from "../reducers/noticeReducer";
import { useAppDispatch } from "./useAppDispatch";

/**
 * 공지를 확인한 사용자 목록을 가져옵니다.
 * @returns
 */
export const useNotice = (noticeId: string) => {
  const dispatch = useAppDispatch();
  const noticeList = useSelector(selectNoticeList);

  useEffect(() => {
    dispatch(initializeNoticeList({ noticeId }));
  }, [noticeId]); // TBD noticeId를 Dependency list에 넣는것이 유의미한지 조사

  return {
    noticeList: useMemo(() => noticeList[noticeId], [noticeList]),
    addUser: useCallback((userId: string) => {
      dispatch(addViewedUser({ noticeId, userId }));
    }, []),
  };
};
