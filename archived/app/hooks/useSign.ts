import { Toast } from "native-base";
import * as Google from "expo-auth-session/providers/google";
import { useCallback } from "react";
import QueAuthClient from "../api/QueAuthUtils";
import { QueAuthResponse } from "../api/interfaces";
import { useAppDispatch } from "./useAppDispatch";
import { clearCredential, setCredential } from "../reducers/authReducer";
import { useNavigation } from "@react-navigation/native";
import { OnBoardingStackNavigationProp } from "../navigators/OnBoardingNavigator";
import { RootStackNavigationProp } from "../navigators/RootNavigator";
import { useConfirm } from "./useConfirm";
import { useLoadingIndicator } from "./useLoadingIndicator";

/** 로그인 과정에서의 에러 메세지 */
const signInErrorMessages: {
  [key in QueAuthResponse | "default"]?: string;
} = {
  "403": `비밀번호를 다시 확인해주세요.`,
  "404": `이메일을 다시 확인해주세요.`,
  "409": `다른 방식으로 로그인해주세요.`,
  "410": `정지된 계정입니다. 문의 부탁드립니다.`,
  "400": `유효하지 않은 이메일입니다.`,
  default: `로그인 과정에서 오류가 발생했습니다.`,
};

const googleClientId =
  "944223797321-3fc5f5sn2l4vl3k3feuf61ckb7mirheb.apps.googleusercontent.com";

/**
 * Google Auth를 통한 계정 인증
 * 이미 등록된 Google 계정이 있으면 로그인 진행 후 main 화면으로
 * 등록된 Google 계정이 없으면 회원 가입 화면으로
 */
export const useSignWithGoogle = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleClientId,
    selectAccount: true,
  });

  const { hideLoading, showLoading } = useLoadingIndicator("");

  const onBoardingNavigator = useNavigation<OnBoardingStackNavigationProp>();

  const dispatch = useAppDispatch();

  return useCallback(async () => {
    showLoading();
    const result = await promptAsync();

    if (result.type === "success") {
      const accessToken = result.authentication?.accessToken!;

      try {
        const loginResult = await QueAuthClient.signInWithGoogle(accessToken);

        /** 에러 발생 시 토스트에 표시할 메세지 */
        let errMsg: string | undefined;

        switch (loginResult.status) {
          case QueAuthResponse.OK: {
            // 로그인 정보 설정
            dispatch(setCredential({ user: loginResult.user }));

            hideLoading();

            // 온보딩 화면 첫 화면으로 넘긴 뒤 로그인 여부 파악 후 메인 화면으로 보내기
            const curNavState = onBoardingNavigator.getState();
            if (curNavState.routes[curNavState.index].name !== "CatchPhrase")
              onBoardingNavigator.reset({ routes: [{ name: "CatchPhrase" }] });

            break;
          }
          case QueAuthResponse.Created: {
            // 새 계정이 생성됨, 프로필 설정 화면으로 이동.
            Toast.show({
              description: "Google 계정을 통해 새 Que 계정을 생성합니다.",
            });

            hideLoading();

            // 네비게이션
            onBoardingNavigator.reset({
              routes: [{ name: "SignUp", params: { hasProvider: true } }],
            });

            // 로그인 정보 설정
            dispatch(setCredential({ user: loginResult.user }));

            break;
          }
          default: {
            errMsg = signInErrorMessages[loginResult.status];

            hideLoading();
            break;
          }
        }

        if (errMsg) {
          Toast.show({ description: errMsg });
        }
      } catch (error) {
        const errorMessage = signInErrorMessages.default + `\n${error}`;
        Toast.show({ description: errorMessage });

        hideLoading();
      }
    } else {
      // 구글 로그인 팝업 오류 처리

      hideLoading();
    }
  }, [response, request]);
};

/**
 * 외부 OAuth Provider 사용 없이 이메일과 비밀번호를 통해 로그인합니다.
 */
export const useSignInWithQue = (navigateAfter?: boolean) => {
  const dispatch = useAppDispatch();

  const onBoardingNavigator = useNavigation<OnBoardingStackNavigationProp>();

  const { hideLoading, showLoading } = useLoadingIndicator("");

  return useCallback(async (userEmail: string, password: string) => {
    showLoading();
    try {
      const loginResult = await QueAuthClient.signInWithQueSelfManaged(
        userEmail,
        password
      );

      /** 에러 발생 시 토스트에 표시할 메세지 */
      let errMsg: string | undefined;

      switch (loginResult.status) {
        case QueAuthResponse.OK: {
          // 로그인 정보 설정
          dispatch(setCredential({ user: loginResult.user }));

          // 이 플래그가 설정되어 있어야지 첫 화면으로 이동
          if (navigateAfter) onBoardingNavigator.navigate("CatchPhrase");
          break;
        }
        default: {
          errMsg = signInErrorMessages[loginResult.status];
          break;
        }
      }

      if (errMsg) {
        Toast.show({ description: errMsg });
      }
    } catch (error) {
      const errorMessage = signInErrorMessages.default + `\n${error}`;
      Toast.show({ description: errorMessage });
    }

    hideLoading();
  }, []);
};

/**
 * 로그아웃을 진행하고 첫 화면으로 이동합니다.
 */
export const useSignOut = () => {
  const dispatch = useAppDispatch();

  /** 로그아웃 질문 용도 */
  const asyncAlert = useConfirm();

  const rootNavigator = useNavigation<RootStackNavigationProp>();

  return useCallback(async () => {
    if (await asyncAlert("로그아웃 하시겠습니까?")) {
      try {
        await QueAuthClient.signOut();

        Toast.show({ description: "안녕히 가세요." });

        dispatch(clearCredential());

        rootNavigator.reset({ routes: [{ name: "OnBoarding" }] });
      } catch (error) {
        alert(`로그아웃 중 에러가 발생했습니다. ${error}`);
      }
    }
  }, []);
};
