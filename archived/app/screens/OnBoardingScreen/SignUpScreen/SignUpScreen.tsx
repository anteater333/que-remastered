import { useIsFocused, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, Alert } from "react-native";
import ScreenCoverLoadingSpinner from "../../../components/common/ScreenCoverLoadingIndicator";
import CommonHeader from "../../../components/headers/CommonHeader";
import WizardNavBar from "../../../components/navbars/WizardNavBar";
import { useConfirm } from "../../../hooks/useConfirm";
import {
  OnBoardingStackNavigationProp,
  OnBoardingStackScreenProp,
  SignUpStackNavigationProp,
  SignUpStackParamList,
} from "../../../navigators/OnBoardingNavigator";
import screens from "../../../styles/screens";
import UserType from "../../../types/User";
import SetPasswordScreen from "./SetPasswordScreen";
import SetUserDescriptionScreen from "./SetUserDescriptionScreen";
import SetUserProfileScreen from "./SetUserProfileScreen";
import { SignUpContext } from "./SignUpContext";
import VerifyMailScreen from "./VerifyMailScreen";

const SignUpStack = createNativeStackNavigator<SignUpStackParamList>();

/**
 * 회원 가입 화면
 */
function SignUpScreen({
  route,
  navigation,
}: OnBoardingStackScreenProp<"SignUp">) {
  // Context states
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
  const [hideButton, setHideButton] = useState<boolean>(true);
  const [buttonAction, setButtonAction] = useState<{ action: () => void }>({
    action: useCallback(() => {}, []),
  });
  const [newUserProfile, setNewUserProfile] = useState<UserType>({});

  /** 건너뛰기 질문용도 */
  const asyncAlert = useConfirm();

  /** 다음 화면으로 이동하기 위한 네비게이터 */
  const signUpNavigator = useNavigation<SignUpStackNavigationProp>();
  /** 건너뛰기를 위한 네비게이터 */
  const onBoardingNavigator = useNavigation<OnBoardingStackNavigationProp>();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      if (!route.params.hasProvider) {
        signUpNavigator.navigate("VerifyMail");
      } else {
        signUpNavigator.navigate("SetUserProfile");
      }
    }
  }, [route.params.hasProvider, isFocused]);

  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <StatusBar translucent={false} />
      <SignUpContext.Provider
        value={{
          buttonEnabled,
          setButtonEnabled,
          hideButton,
          setHideButton,
          buttonAction,
          setButtonAction,
          signUpNavigator,
          newUserProfile,
          setNewUserProfile,
        }}
      >
        <SignUpStack.Navigator
          initialRouteName={
            route.params.hasProvider ? "SetUserProfile" : "VerifyMail"
          }
          screenOptions={{
            contentStyle: screens.defaultScreenLayout,
            header: (props) => (
              <CommonHeader replaceTitleWithLogo hideButton={true} {...props} />
            ),
          }}
        >
          <SignUpStack.Group>
            <SignUpStack.Screen
              options={{
                header: (props) => <CommonHeader hideButton {...props} />,
                title: "",
              }}
              name="VerifyMail"
              component={VerifyMailScreen}
            />
            <SignUpStack.Screen
              name="SetPassword"
              component={SetPasswordScreen}
            />
          </SignUpStack.Group>
          <SignUpStack.Group>
            <SignUpStack.Screen
              options={{
                header: (props) => (
                  <CommonHeader hideBackButton hideButton {...props} />
                ),
              }}
              name="SetUserProfile"
              component={SetUserProfileScreen}
            />
            <SignUpStack.Screen
              name="SetUserDescription"
              component={SetUserDescriptionScreen}
            />
          </SignUpStack.Group>
        </SignUpStack.Navigator>
        <SignUpContext.Consumer>
          {({ buttonEnabled, buttonAction, hideButton }) => (
            <WizardNavBar
              hideSkipButton={hideButton}
              enableNextButton={buttonEnabled}
              onSkip={async () => {
                if (
                  await asyncAlert(
                    "다음에 하시겠습니까?",
                    "하지만 프로필 변경 기능은 아직 구현 중입니다."
                  )
                ) {
                  onBoardingNavigator.navigate("CatchPhrase");
                }
              }}
              onNext={buttonAction.action}
            />
          )}
        </SignUpContext.Consumer>
      </SignUpContext.Provider>
    </SafeAreaView>
  );
}

/**
 * TBD: 추가 개인화 화면 기획 & 개발, 장기계획
 */

export default SignUpScreen;
