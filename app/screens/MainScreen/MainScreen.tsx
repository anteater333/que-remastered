import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import DummyComponent from "../../components/common/DummyComponent";
import MainScreenHeader from "../../components/headers/MainScreenHeader";
import { MainStackParamList } from "../../navigators/MainNavigator";
import screens from "../../styles/screens";
import HomeScreen from "./HomeScreen/HomeScreen";
import UploadScreen from "./UploadScreen/UploadScreen";
import UserPageScreen from "./UserPageScreen";
import VideoEditScreen from "./VideoEditScreen";
import VideoScreen from "./VideoScreen";

/** 메인 스택 네비게이터 컴포넌트 */
const MainStack = createNativeStackNavigator<MainStackParamList>();

/**
 * 어플리케이션 메인 스크린
 */
function MainScreen() {
  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <MainStack.Navigator
        screenOptions={{
          header: (props) => <MainScreenHeader {...props} />,
        }}
      >
        <MainStack.Screen name="Home" component={HomeScreen} />
        <MainStack.Screen
          name="Upload"
          options={{ headerShown: false }}
          component={UploadScreen}
        />
        <MainStack.Screen
          name="Video"
          options={{ headerShown: false }}
          component={VideoScreen}
        />
        <MainStack.Screen name="UserPage" component={UserPageScreen} />
        <MainStack.Screen name="Notification" component={DummyComponent} />
        <MainStack.Screen name="Search" component={DummyComponent} />
        <MainStack.Screen
          name="VideoEdit"
          options={{ headerShown: false }}
          component={VideoEditScreen}
        />
      </MainStack.Navigator>
    </SafeAreaView>
  );
}

export default MainScreen;
