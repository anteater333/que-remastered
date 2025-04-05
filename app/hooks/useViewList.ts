import { useCallback } from "react";
import { useSelector } from "react-redux";
import QueResourceClient from "../api/QueResourceUtils";
import { selectViewList } from "../reducers/authReducer";
import { useAppDispatch } from "./useAppDispatch";
import { addViewedVideo } from "../reducers/authReducer";

/** 로그인 한 사용자가 시청한 목록을 저장해 중복을 방지하면서 시청 수 증가를 하는 함수를 반환합니다. */
export const useViewList = () => {
  const dispatch = useAppDispatch();

  const viewList = useSelector(selectViewList);

  return useCallback(
    async (videoId: string) => {
      if (viewList[videoId]) {
        // 이미 시청함
        // do nothing
        return;
      } else {
        // 시청 수 상승
        try {
          const result = await QueResourceClient.increaseVideoViewCount(
            videoId
          );
          if (result.success) dispatch(addViewedVideo({ videoId: videoId }));
        } catch (error) {
          console.error(error);
          return;
        }
      }
    },
    [viewList]
  );
};
