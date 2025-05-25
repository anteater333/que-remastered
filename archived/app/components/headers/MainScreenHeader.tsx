import { useAssets } from "expo-asset";
import {
  Image,
  ImageSourcePropType,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { mainScreenHeaderStyle } from "./header.style";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { MainStackNavigationProp } from "../../navigators/MainNavigator";
import ProfilePictureButton from "../buttons/ProfilePictureButton";
import { useSignOut } from "../../hooks/useSign";
import { useAuth } from "../../hooks/useAuth";
import { useNotImplementedWarning } from "../../hooks/useWarning";
import { HeaderBackButton } from "@react-navigation/elements";

const styles = mainScreenHeaderStyle;

/**
 * 홈 스크린 적용 헤더
 */
function MainScreenHeader(props: NativeStackHeaderProps) {
  /** 어플리케이션 로고 asset 붙여놓기 */
  const [assets, error] = useAssets([
    require("../../assets/custom/haeder-logo.png"),
  ]);

  /** 메인 네비게이터 사용 */
  const mainNavigator = useNavigation<MainStackNavigationProp>();

  return (
    <SafeAreaView style={styles.default} testID="homeScreenHeader">
      {props.back ? (
        <>
          <HeaderBackButton onPress={() => props.navigation.goBack()} />
          <Text
            numberOfLines={2}
            ellipsizeMode={"tail"}
            style={[styles.titleText]}
          >
            {props.back.title}
          </Text>
        </>
      ) : (
        <View style={styles.titleContainer} testID="homeHeaderTitleContainer">
          <TouchableOpacity
            onPress={() => {
              mainNavigator.navigate("Home");
            }}
          >
            {assets ? (
              <Image
                style={styles.titleLogo}
                source={assets[0] as ImageSourcePropType}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      )}
      <HomeHeaderButtonGroup />
    </SafeAreaView>
  );
}

/** 버튼 묶음 코드 분리 */
function HomeHeaderButtonGroup() {
  /** 메인 네비게이터 사용 */
  const navigation = useNavigation<MainStackNavigationProp>();

  /** 임시 로그아웃 버튼 */
  const signOut = useSignOut();

  const notImplemented = useNotImplementedWarning();

  /** 알림 버튼을 누르면 알림 화면으로 */
  const handleOnPressAlarm = useCallback(() => {
    // TBD navigation.navigate("Notification");
    notImplemented();
  }, []);

  /** 검색 버튼을 누르면 검색 화면으로 */
  const handleOnPressSearch = useCallback(() => {
    // TBD navigation.navigate("Search");
    notImplemented();
  }, []);

  const { user } = useAuth();

  return (
    <View style={styles.buttonsContainer} testID="homeHeaderButtonsContainer">
      <TouchableOpacity
        style={styles.headerButtonView}
        onPress={handleOnPressSearch}
        accessibilityRole="button"
      >
        <MaterialIcons style={styles.headerButtonIcon} name="search" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.headerButtonView}
        onPress={handleOnPressAlarm}
        accessibilityRole="button"
      >
        <MaterialIcons
          style={styles.headerButtonIcon}
          name="notifications-none"
        />
      </TouchableOpacity>
      <View style={styles.headerButtonView}>
        <ProfilePictureButton
          userId={user.userId!}
          style={styles.headerProfilePicSize}
        />
      </View>
    </View>
  );
}

export default MainScreenHeader;
