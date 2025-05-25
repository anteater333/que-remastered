import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import CommonHeader from "../../components/headers/CommonHeader";
import { OnBoardingStackParamList } from "../../navigators/OnBoardingNavigator";
import screens from "../../styles/screens";
import SignInScreen from "./SignInScreen/SignInScreen";
import SignUpScreen from "./SignUpScreen/SignUpScreen";

import { CatchPhraseScreen } from "./CatchPhraseScreen";

const OnBoardingStack = createNativeStackNavigator<OnBoardingStackParamList>();

/**
 * 회원가입 OR 로그인 권유 온보딩 화면, 네비게이션으로 이루어짐
 */
function OnBoardingScreen() {
  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <OnBoardingStack.Navigator screenOptions={{ headerShown: false }}>
        <OnBoardingStack.Screen
          name="CatchPhrase"
          component={CatchPhraseScreen}
        />
        <OnBoardingStack.Screen
          options={{
            headerShown: true,
            header: (props) => <CommonHeader hideButton {...props} />,
          }}
          name="SignIn"
          component={SignInScreen}
        />
        <OnBoardingStack.Screen
          name="SignUp"
          component={SignUpScreen}
          initialParams={{}}
        />
      </OnBoardingStack.Navigator>
    </SafeAreaView>
  );
}

export default OnBoardingScreen;
