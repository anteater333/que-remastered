import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import navBarStyle, { iconStyles } from "./navbar.style";
import { MaterialIcons } from "@expo/vector-icons";
import { useAssets } from "expo-asset";
import { useNotImplementedWarning } from "../../hooks/useWarning";

/** 스타일 객체 */
const styles = navBarStyle;

/**
 * 홈 스크린 적용 커스텀 네비게이션 바
 */
function HomeNavBar(props: BottomTabBarProps) {
  const [assets, error] = useAssets([
    require("../../assets/custom/upload.png"),
  ]);

  /** Icon dictionary */
  const buttonIcons = (name: string, isFocused: boolean) => {
    const dict: {
      [index: string]: any;
    } = {
      /** 업로드 버튼은 조금 강조됩니다. */
      Upload: assets ? (
        <Image
          resizeMode="contain"
          style={styles.uploadButtonImage}
          source={assets[0] as ImageSourcePropType}
        />
      ) : null,
      // 그 외 네비게이션 버튼은 형식을 통일
      Timeline: (
        <View style={styles.buttonContainer}>
          <MaterialIcons
            name="video-library"
            size={iconStyles.buttonIcon.fontSize}
            color={
              isFocused
                ? iconStyles.buttonIconSelected.color
                : iconStyles.buttonIcon.color
            }
          />
          <Text
            style={isFocused ? styles.buttonFontSelected : styles.buttonFont}
          >
            영상
          </Text>
        </View>
      ),
      Preference: (
        <View style={styles.buttonContainer}>
          <MaterialIcons
            name="settings"
            size={iconStyles.buttonIcon.fontSize}
            color={
              isFocused
                ? iconStyles.buttonIconSelected.color
                : iconStyles.buttonIcon.color
            }
          />
          <Text
            style={isFocused ? styles.buttonFontSelected : styles.buttonFont}
          >
            설정
          </Text>
        </View>
      ),
    };

    return dict[name];
  };

  const notImplemented = useNotImplementedWarning();

  /**
   * 네비게이션 바 버튼 컴포넌트 매핑
   */
  const navButtonMapper = props.state.routes.map((route, index) => {
    const { options } = props.descriptors[route.key];
    const isFocused = props.state.index === index;
    const icon = buttonIcons(route.name, isFocused);

    /** 버튼 누를 시 네비게이션 수행 */
    const handleOnPress = () => {
      const event = props.navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        if (route.name === "Upload") {
          // 업로드 화면의 경우 상위의 main stack navigator 사용
          props.navigation.getParent()?.navigate(route.name, { merge: true });
        } else {
          // `merge: true` 옵션은 탭 스크린 안의 파라미터가 보존되도록 한다.
          props.navigation.navigate(route.name, { merge: true });
        }
      }
    };

    /** 버튼 길게 누를 시 (행동 보류)  */
    const handleOnLongPress = () => {
      props.navigation.emit({
        type: "tabLongPress",
        target: route.key,
      });
    };

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={handleOnPress}
        onLongPress={handleOnLongPress}
        style={styles.buttonTouchableArea}
      >
        {icon}
      </TouchableOpacity>
    );
  });

  return <View style={styles.default}>{navButtonMapper}</View>;
}

export default HomeNavBar;
