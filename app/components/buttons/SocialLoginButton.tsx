import { useAssets } from "expo-asset";
import { useEffect, useState } from "react";
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  Pressable,
  PressableProps,
  View,
  ViewProps,
} from "react-native";
import socialLoginButtonStyles from "./SocialLoginButton.style";

const styles = socialLoginButtonStyles;

export type SocialButtonType = "default" | "google" | "kakao" | "naver";

/**
 * 버튼 컴포넌트 프로퍼티
 */
export interface SocialLoginButtonProps extends ViewProps {
  buttonType?: SocialButtonType;
  size?: number;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
}

/**
 * Que 어플리케이션에서 기본적으로 자주 사용하게 될 끝이 둥근 네모난 버튼 컴포넌트
 * <Text> 처럼 사용할 수 있습니다.
 */
function SocialLoginButton(props: SocialLoginButtonProps) {
  const [imgNumber, setImgNumber] = useState<number>(0);

  const [assets, error] = useAssets([
    require("../../assets/favicon.png"),
    require("../../assets/socials/google-small.png"),
    require("../../assets/socials/naver-small.png"),
    require("../../assets/socials/kakao-small.png"),
  ]);

  useEffect(() => {
    switch (props.buttonType) {
      case "google":
        setImgNumber(1);
        break;
      case "naver":
        setImgNumber(2);
        break;
      case "kakao":
        setImgNumber(3);
        break;
      default:
        setImgNumber(0);
    }
  }, [props.buttonType]);

  return (
    <View testID={props.testID} style={[styles.buttonContainer, props.style]}>
      <Pressable
        testID="socialLoginButtonPressable"
        style={styles.buttonPressable}
        onPress={props.onPress}
      >
        {assets ? (
          <Image
            style={styles.buttonImage}
            source={assets[imgNumber] as ImageSourcePropType}
          />
        ) : null}
      </Pressable>
    </View>
  );
}

export default SocialLoginButton;
