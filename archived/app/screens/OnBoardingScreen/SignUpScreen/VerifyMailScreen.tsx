import { useAssets } from "expo-asset";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { Toast } from "native-base";
import { QueAuthResponse } from "../../../api/interfaces";
import authClient from "../../../api/QueAuthUtils";
import CommonTextInput from "../../../components/inputs/CommonTextInput";
import screens from "../../../styles/screens";
import { validateEmail } from "../../../utils/validator";
import { SignUpContext } from "./SignUpContext";
import { signUpScreenStyle } from "./SignUpScreen.style";
import { useLoadingIndicator } from "../../../hooks/useLoadingIndicator";

/** 메일 입력 후 오류 안내 메세지 */
const failMessages: {
  [key in QueAuthResponse | "default"]?: string;
} = {
  "429":
    "해당 메일로 너무 많은 요청이 들어왔습니다. \n나중에 다시 시도해주세요.",
  "409": "해당 메일로 이미 가입한 사용자가 존재합니다.",
  default: `인증 메일을 전송하는 과정에서 오류가 발생했습니다.\n메일 주소를 다시 확인해주세요.`,
};

/** 인증번호 입력 후 오류 안내 메세지 */
const codeMatchingMessages: {
  [key in QueAuthResponse | "default"]?: string;
} = {
  "429": `너무 많이 틀렸습니다!\n인증 번호를 다시 요청해주세요.`,
  "408": `입력 시간을 초과했습니다.\n인증 번호를 다시 요청해주세요`,
  "403": `잘못된 인증번호입니다. 다시 입력해주세요.`,
  default: `인증 과정에서 오류가 발생했습니다.`,
};

/**
 * Step 1. 이메일 확인
 * @returns
 */
export default function VerifyMailScreen() {
  /** 사용자가 입력한 email 주소 */
  const [userEmail, setUserEmail] = useState<string>("");
  /** 메일 주소 검증, 메일 전송 실패 시 시각적 표시 용도 */
  const [isMailInvalid, setIsMailInvalid] = useState<boolean>(false);
  /** 매일 전송 실패 시 메세지 설정 */
  const [failMessage, setFailMessage] = useState<string | undefined>(
    failMessages.default
  );
  /** 인증 코드 입력 데이터 */
  const [verifyingCode, setVerifyingCode] = useState<string>("");
  /** 인증 코드 검증 성공 여부, 실패 시 시각적 표시 용도 */
  const [isCodeMatching, setIsCodeMatching] = useState<boolean>(true);
  /** 인증 코드 입력 실패 시 메세지 설정  */
  const [codeMatchingMessage, setCodeMatchingMessage] = useState<
    string | undefined
  >(codeMatchingMessages.default);
  /** 메일 발송 요청 여부 */
  const [sentMail, setSentMail] = useState<boolean>(false);
  /** 인증 가능 잔여 시간 표시 */
  const [timer, setTimer] = useState<number>(0);

  /** 로고 표시용 에셋 접근 */
  const [assets, error] = useAssets([
    require("../../../assets/custom/logo-big.png"),
  ]);

  /** SignUp 컨텍스트 사용 */
  const {
    buttonEnabled,
    setButtonEnabled,
    setHideButton,
    buttonAction,
    setButtonAction,
    signUpNavigator,
  } = useContext(SignUpContext);

  const { hideLoading, showLoading } = useLoadingIndicator();

  /** TBD: In RN w/ typescript, using ref for custom functional component. To autofocus on second textinput */
  // ref 사용방법 갈구하란 의미입니다.
  // const textInputEmail = useRef();
  // const textInputCode = useRef();

  /** 메일을 전송하고 전송 여부에 따라 인증 코드 입력 UI를 활성화합니다. */
  const sendVerificationMail = useCallback(async () => {
    showLoading();
    try {
      // 메일 요청
      const mailReqResult = await authClient.requestVerificationCodeMail(
        userEmail
      );

      if (mailReqResult === QueAuthResponse.OK) {
        // 메일 전송 성공에 따라 다음 UI 활성화
        setIsMailInvalid(false);
        setSentMail(true);
        setVerifyingCode("");
        setButtonEnabled(false);
        setTimer(300);
      } else if (mailReqResult === QueAuthResponse.AlreadyPassed) {
        // 메일 인증 이미 성공한 계정
        // 코드 인증 생략하고 비밀번호 설정 화면으로
        Toast.show({ description: `저장된 인증 정보를 확인했습니다.` });
        signUpNavigator!.navigate("SetPassword", { userEmail: userEmail });
      } else {
        // 메일 전송 실패
        setIsMailInvalid(true);

        const strStatusCode = mailReqResult;
        if (strStatusCode in failMessages) {
          setFailMessage(failMessages[strStatusCode]);
        } else {
          setFailMessage(failMessages.default);
        }
      }
    } catch (error) {
      setIsMailInvalid(true);
      setFailMessage(failMessages.default);
      alert("메일 전송 요청 과정에서 에러가 발생했습니다 : " + error);
    }
    hideLoading();
  }, [userEmail]);

  /** 사용자가 입력한 코드를 검증한 다음 결과에 따라 다음 단계로 넘어갑니다. */
  const verifyWithCode = useCallback(async () => {
    hideLoading();
    try {
      // 코드 인증 요청
      const reqResult = await authClient.sendVerificationCode(
        userEmail,
        verifyingCode
      );

      const succeeded = reqResult === QueAuthResponse.OK;

      if (succeeded) {
        setIsCodeMatching(true);
        // 다음 화면 이동
        signUpNavigator!.navigate("SetPassword", { userEmail: userEmail });
      } else {
        // 에러 표시
        setIsCodeMatching(false);

        const strStatusCode = reqResult;
        if (strStatusCode in codeMatchingMessages) {
          setCodeMatchingMessage(codeMatchingMessages[strStatusCode]);
        } else {
          setCodeMatchingMessage(codeMatchingMessages.default);
        }
      }
    } catch (error) {
      setIsCodeMatching(false);
      setCodeMatchingMessage(codeMatchingMessages.default);
      alert(`인증 과정에서 에러가 발생했습니다 : ${error}`);
    }
    hideLoading();
  }, [userEmail, verifyingCode]);

  /** 첫 렌더링 시 입력 데이터 초기화 */
  useEffect(() => {
    setVerifyingCode("");
    setHideButton(true);
  }, []);

  /** 진행 여부에 따라 navbar 버튼 활성화 로직 지정 */
  useEffect(() => {
    if (!sentMail) setButtonEnabled(validateEmail(userEmail));
    if (sentMail && verifyingCode.length >= 6) setButtonEnabled(true);
  }, [userEmail, verifyingCode, sentMail]);

  /** 인증 가능 시간 타이머 설정 */
  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else if (timer === 0) {
        clearInterval(countdown); // 타이머 종료
      }
    }, 1000);

    return () => clearInterval(countdown); // useEffect 콜백의 return은 컴포넌트가 unmount 될 때의 동작을 의미
  }, [timer]);

  /**  진행 여부에 따라 navbar button의 onPress 행동 결정 */
  useEffect(() => {
    if (sentMail) {
      setButtonAction({ action: verifyWithCode });
    } else {
      setButtonAction({ action: sendVerificationMail });
    }
  }, [sentMail, userEmail, verifyingCode]); // Warning, 할당하려는 함수의 dependency도 고려해야함

  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <View
        style={signUpScreenStyle.titleContainer}
        testID="signUpTitleContainer"
      >
        {assets ? (
          <Image
            style={signUpScreenStyle.titleLogo}
            source={assets[0] as ImageSourcePropType}
          />
        ) : null}
        <Text style={signUpScreenStyle.titleText}>회원가입</Text>
      </View>

      <View style={signUpScreenStyle.bottomContainer}>
        <View>
          <CommonTextInput
            style={signUpScreenStyle.textInput}
            autoFocus
            invalid={isMailInvalid}
            accessibilityRole="text"
            textContentType="emailAddress"
            keyboardType="email-address"
            placeholder="이메일 주소를 입력해주세요."
            onChangeText={(newStr) => setUserEmail(newStr)}
            value={userEmail}
            onKeyPress={(event) => {
              if (event.nativeEvent.key == "Enter" && buttonEnabled) {
                if (!sentMail) {
                  buttonAction.action();
                }
              } else {
                // do nothing
              }
            }}
          />
        </View>
        {isMailInvalid ? (
          <View>
            <Text
              style={[
                signUpScreenStyle.messageText,
                signUpScreenStyle.errorMessageText,
              ]}
            >
              {failMessage}
            </Text>
          </View>
        ) : null}
        {sentMail ? (
          <View>
            <CommonTextInput
              style={signUpScreenStyle.textInput}
              autoFocus
              invalid={!isCodeMatching}
              textContentType="oneTimeCode"
              keyboardType="default"
              accessibilityRole="text"
              placeholder="인증번호"
              onChangeText={(newStr) => setVerifyingCode(newStr)}
              value={verifyingCode}
              onKeyPress={(event) => {
                if (event.nativeEvent.key == "Enter" && buttonEnabled) {
                  if (sentMail) {
                    buttonAction.action();
                  }
                } else {
                  // do nothing
                }
              }}
            />
            {isCodeMatching ? null : (
              <Text
                style={[
                  signUpScreenStyle.messageText,
                  signUpScreenStyle.errorMessageText,
                ]}
              >
                {codeMatchingMessage}
              </Text>
            )}
            <Text style={signUpScreenStyle.messageText}>
              {`입력하신 이메일로 인증번호를 전송했습니다.\n인증번호는 ${timer}초 이후 만료됩니다.`}
              <Text
                style={signUpScreenStyle.messageTextButton}
                onPress={sendVerificationMail}
                accessibilityRole="button"
              >
                {` 재전송 `}
              </Text>
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
