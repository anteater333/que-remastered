import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import DummyComponent from "../../../components/common/DummyComponent";
import HomeNavBar from "../../../components/navbars/HomeNavbar";
import { HomeTabParamList } from "../../../navigators/HomeNavigator";
import PreferenceScreen from "./PreferenceScreen/PreferenceScreen";
import TimelineScreen from "./TimelineScreen";

/** 홈 네비게이터 객체 */
const HomeTab = createBottomTabNavigator<HomeTabParamList>();

/**
 * 어플리케이션 홈 스크린
 */
function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <HomeTab.Navigator
        tabBar={(props) => <HomeNavBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <HomeTab.Screen
          name="Timeline"
          component={TimelineScreen}
          options={{ title: "영상" }}
        />
        <HomeTab.Screen name="Upload" component={DummyComponent} />
        <HomeTab.Screen
          name="Preference"
          component={PreferenceScreen}
          options={{ title: "설정" }}
        />
      </HomeTab.Navigator>
    </View>
  );
}
export default HomeScreen;
