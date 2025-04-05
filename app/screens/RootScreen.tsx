import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import screens from "../styles/screens";
import { RootStackParamList } from "../navigators/RootNavigator";
import MainScreen from "./MainScreen/MainScreen";
import OnBoardingScreen from "./OnBoardingScreen/OnBoardingScreen";

/** 최상단 네비게이터 */
const RootStack = createNativeStackNavigator<RootStackParamList>();

/**
 * 최상단 네비게이터가 담길 화면
 * 메인 서비스 화면들과 가입&로그인 화면들 사이에서
 * 사용자의 로그인 여부에 따라 표현할 화면을 결정한다.
 */
function RootScreen(props: { isSigned: boolean }) {
  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <RootStack.Navigator
        initialRouteName={props.isSigned ? "Main" : "OnBoarding"}
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="OnBoarding" component={OnBoardingScreen} />
        <RootStack.Screen name="Main" component={MainScreen} />
      </RootStack.Navigator>
    </SafeAreaView>
  );
}

export default RootScreen;
