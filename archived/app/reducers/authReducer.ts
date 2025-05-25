import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

import UserType from "../types/User";

/** 현재 로그인 한 사용자 상태 */
export type AuthState = {
  /** 사용자 프로필 정보 */
  user: UserType;
  /** 사용자 로그인 여부 */
  isSigned: boolean;
  /** 사용자가 시청한 목록 */ // 사용자가 로그인한 동안 시청한 영상들을 저장합니다. 중복 View Counting을 방지합니다.
  viewList: { [videoId: string]: boolean };
};

/** 최초 상태 */
const initialState: AuthState = {
  user: {},
  isSigned: false,
  viewList: {},
};

// Ducks 패턴
/** Auth 관련 상태 저장소 생성 */
const { actions, reducer: authReducer } = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    /**
     * 로그인한 사용자의 정보를 저장합니다.
     * 필요한 정보만 담도록 내부적으로 제한 합니다.
     */
    setCredential: (state, action: PayloadAction<{ user: UserType }>) => {
      const newUserState: UserType = {
        profilePictureUrl: action.payload.user.profilePictureUrl,
        nickname: action.payload.user.nickname,
        level: action.payload.user.level,
        userId: action.payload.user.userId,
        email: action.payload.user.email,
        description: action.payload.user.description,
      };
      state.user = newUserState;
      state.isSigned = true;
    },
    /** 사용자 정보를 상태에서 제거합니다. */
    clearCredential: (state) => {
      state.user = {};
      state.isSigned = false;
      state.viewList = {};
    },
    /** 시청한 영상을 목록에 추가합니다. */
    addViewedVideo: (state, action: PayloadAction<{ videoId: string }>) => {
      state.viewList[action.payload.videoId] = true;
    },
  },
  extraReducers: {},
});

export const { setCredential, clearCredential, addViewedVideo } = actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsSigned = (state: RootState) => state.auth.isSigned;
export const selectViewList = (state: RootState) => state.auth.viewList;

export default authReducer;
