import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

/**
 * 신규 회원 가입, 사용자 로그인 기능이 담길 네비게이터
 */
export type OnBoardingStackParamList = {
  CatchPhrase: undefined;
  SignUp: { hasProvider?: boolean };
  SignIn: undefined;
};

/**
 * 네비게이터 프로퍼티 타이핑
 */
export type OnBoardingStackNavigationProp =
  NativeStackNavigationProp<OnBoardingStackParamList>;

/**
 * 네비게이터 스크린 컴포넌트 멤버 별 프로퍼티 타이핑
 */
export type OnBoardingStackScreenProp<
  T extends keyof OnBoardingStackParamList
> = NativeStackScreenProps<OnBoardingStackParamList, T>;

/** 신규 회원 가입, 순차적으로 진행 */
export type SignUpStackParamList = {
  VerifyMail: undefined;
  SetPassword: { userEmail: string };
  SetUserProfile: undefined;
  SetUserDescription: undefined;
};

/**
 * 네비게이터 프로퍼티 타이핑
 */
export type SignUpStackNavigationProp =
  NativeStackNavigationProp<SignUpStackParamList>;

/**
 * 네비게이터 스크린 컴포넌트 멤버 별 프로퍼티 타이핑
 */
export type SignUpStackScreenProp<T extends keyof SignUpStackParamList> =
  NativeStackScreenProps<SignUpStackParamList, T>;
