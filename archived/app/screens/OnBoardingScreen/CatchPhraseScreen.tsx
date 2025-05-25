import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useAssets } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import RoundedButton from "../../components/buttons/RoundedButton";
import { OnBoardingStackNavigationProp } from "../../navigators/OnBoardingNavigator";
import { RootStackNavigationProp } from "../../navigators/RootNavigator";
import { bColors, bFont, bSpace } from "../../styles/base";
import screens from "../../styles/screens";
import * as WebBrowser from "expo-web-browser";
import { styles } from "./OnBoardingScreen.style";
import { useSignWithGoogle } from "../../hooks/useSign";
import { useAuth } from "../../hooks/useAuth";
import { Toast } from "native-base";

WebBrowser.maybeCompleteAuthSession();

/**
 * 캐치프레이즈 & 회원가입 권유
 * 백그라운드에 휘황찬란한 GIF
 * @returns
 */
export function CatchPhraseScreen() {
  /** 로그인 여부 */
  const [signed, setSigned] = useState<boolean>(false);

  /** TBD: 영상 교체하기 */
  const mockingVideoSrc = "https://i.postimg.cc/mgdFtJd5/welcome.gif";

  const onBoardingNavigator = useNavigation<OnBoardingStackNavigationProp>();
  const rootNavigator = useNavigation<RootStackNavigationProp>();

  /** 사용자 로그인 여부 파악 */
  const { user } = useAuth();

  const [assets, error] = useAssets([
    require("../../assets/custom/logo-colored.png"),
    require("../../assets/custom/google-icon.png"),
    require("../../assets/custom/que-icon.png"),
  ]);

  /** 화면이 뒤로가기 버튼을 통해 표시되더라도 useEffect 발동시키기 */
  const isFocused = useIsFocused();

  /** 로그인 여부 저장 */
  useEffect(() => {
    if (isFocused) {
      setSigned(!!user.userId);
    }
  }, [isFocused, user.userId]);

  /** 로그인 여부 파악 완료되면 화면 전환 */
  useEffect(() => {
    if (isFocused && signed && !!user.userId) {
      // Toast.show({ description: `안녕하세요. ${user.nickname}님.` });
      // 로그인 되어 있다면 메인 화면으로
      rootNavigator.reset({ routes: [{ name: "Main" }] });
    }
  }, [isFocused, signed, user.userId]);

  /**
   * Google Auth를 통한 계정 인증
   * 이미 등록된 Google 계정이 있으면 로그인 진행 후 main 화면으로
   * 등록된 Google 계정이 없으면 회원 가입 화면으로
   */
  const signWithGoogle = useSignWithGoogle();

  const signUpNewQueUser = useCallback(() => {
    onBoardingNavigator.navigate("SignUp", {});
  }, []);

  return (
    <SafeAreaView style={[screens.defaultScreenLayout]}>
      <StatusBar translucent={true} />
      <ImageBackground
        testID="serviceMockingVideo"
        source={{ uri: mockingVideoSrc }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View testID="emptySpace" style={{ flex: 1 }}></View>
        <LinearGradient
          testID="darkOverlay"
          colors={["transparent", bColors.black]}
          start={{ x: 0, y: -1 }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
        <View
          testID="onBoardingContextContainer"
          style={styles.contextContainer}
        >
          <View testID="logoContainer">
            {assets ? (
              <Image source={assets[0] as ImageSourcePropType}></Image>
            ) : null}
          </View>
          <View
            testID="catchPhraseContainer"
            style={styles.catchPhraseContainer}
          >
            <Text style={styles.catchPhraseText}>
              당신의 콘서트를{"\n"}
              시작하세요.
            </Text>
          </View>
          <View testID="signUpButtonContainer" style={styles.buttonContainer}>
            <RoundedButton
              testID="googleSignButton"
              buttonType="white"
              style={{
                height: bFont.xlarge + bFont.large,
                marginBottom: bSpace.xlarge,
                fontSize: bFont.large,
              }}
              bold={true}
              iconData={{
                iconType: "image",
                withText: true,
                iconSize: bFont.xlarge,
                imageSrc: assets ? (assets[1] as ImageSourcePropType) : {},
              }}
              onPress={signWithGoogle}
            >
              Google 계정으로 계속하기
            </RoundedButton>
            <RoundedButton
              testID="queSignUpButton"
              buttonType="primary"
              bold={true}
              style={{
                height: bFont.xlarge + bFont.large,
                marginBottom: bSpace.xlarge,
                fontSize: bFont.large,
              }}
              iconData={{
                iconType: "image",
                withText: true,
                iconSize: bFont.xlarge,
                imageSrc: assets ? (assets[2] as ImageSourcePropType) : {},
              }}
              onPress={signUpNewQueUser}
            >
              QUE 계정 만들기
            </RoundedButton>
          </View>
          <View testID="signInTextContainer">
            <Text style={styles.signInSuggestionText}>이미 계정이 있다면</Text>
            <Text>
              {/** 이 Text 컴포넌트를 통한 Wrapping은 하위 컴포넌트의 크기가 텍스트의 길이에 맞춰지도록 만듭니다. */}
              <Text
                style={[styles.signInSuggestionText, styles.signInButtonText]}
                onPress={() => {
                  onBoardingNavigator.navigate("SignIn");
                }}
                accessibilityRole="button"
              >
                로그인
              </Text>
            </Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
