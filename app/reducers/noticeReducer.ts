import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

/** 사용자 공지 표출 여부 상태 */
export type NoticeState = {
  /** 공지별로 공지를 본 사용자 목록 */
  noticeList: { [noticeId: string]: { [userId: string]: boolean } };
};

/** 최초 상태 */
const initialState: NoticeState = {
  noticeList: {},
};

// Ducks 패턴
/** Notice 관련 상태 저장소 생성 */
const { actions, reducer: noticeReducer } = createSlice({
  name: "notice",
  initialState: initialState,
  reducers: {
    /** 해당 공지에 대한 목록을 초기화합니다. */
    initializeNoticeList: (
      state,
      action: PayloadAction<{ noticeId: string }>
    ) => {
      const { noticeId } = action.payload;
      if (!state.noticeList[noticeId]) {
        state.noticeList[noticeId] = {};
      }
    },
    /** 시청한 영상을 목록에 추가합니다. */
    addViewedUser: (
      state,
      action: PayloadAction<{ noticeId: string; userId: string }>
    ) => {
      const { noticeId, userId } = action.payload;
      if (!state.noticeList[noticeId]) {
        state.noticeList[noticeId] = {};
      }

      state.noticeList[noticeId][userId] = true;
    },
  },
  extraReducers: {},
});

export const { addViewedUser, initializeNoticeList } = actions;

export const selectNoticeList = (
  state: RootState
): {
  [noticeId: string]: {
    [userId: string]: boolean;
  };
} => state.notice.noticeList;

export default noticeReducer;
