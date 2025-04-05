import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

/**
 * 설정 화면을 위한 네비게이터
 * TBD 자연스럽게 메뉴의 깊이가 깊어질 수도 있을 건데, 이렇게 네비게이션을 통해 구현하는 것이 적절한지 생각해보기
 */
export type PreferenceStackParamList = {
  MainMenu: undefined;
  DevInfo: undefined;
};

/**
 * 네비게이터 프로퍼티 타이핑
 */
export type PreferenceStackNavigationProp =
  NativeStackNavigationProp<PreferenceStackParamList>;

/** 스크린 컴포넌트 별 프로퍼티 타이핑 */
export type PreferenceStackScreenProp<
  T extends keyof PreferenceStackParamList
> = NativeStackScreenProps<PreferenceStackParamList, T>;
