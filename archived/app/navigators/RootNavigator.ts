import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

/**
 * 어플리케이션 최상단 네비게이터에 소속될 스크린 목록
 */
export type RootStackParamList = {
  OnBoarding: undefined;
  Main: undefined;
};

/**
 * 네비게이터 프로퍼티 타이핑
 */
export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

/**
 * 네비게이터 스크린 컴포넌트 멤버 별 프로퍼티 타이핑
 */
export type RootStackScreenProp<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
