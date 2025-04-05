import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

/**
 * 비디오 업로드 기능 화면이 담길 네비게이터의 화면 목록
 */
export type UploadStackParamList = {
  /** 새 영상을 촬영할지, 기존 파일을 업로드할지 선택하는 화면 */
  SelectType: undefined;
  /** 영상에 대한 메타 정보를 입력하는 화면 */
  InputData: undefined;
  /** 
   * 음악 정보를 검색하는 화면
   * TBD 좀 더 넓은 범위에서 재사용 가능하도록
   *     이 네비게이션에 포함되지 않는 별개의 화면 컴포넌트로 변경하기
   */
  SearchSong: undefined;
};

/**
 * 네비게이터 프로퍼티 타이핑
 */
export type UploadStackNavigationProp =
  NativeStackNavigationProp<UploadStackParamList>;

/**
 * 네비게이터 스크린 컴포넌트 멤버 별 프로퍼티 타이핑
 */
export type UploadStackScreenProp<T extends keyof UploadStackParamList> =
  NativeStackScreenProps<UploadStackParamList, T>;
