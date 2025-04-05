import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSignOut } from "../../../../hooks/useSign";
import screens from "../../../../styles/screens";
import { MaterialIcons } from "@expo/vector-icons";
import { bColors, bFont, bSpace } from "../../../../styles/base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  PreferenceStackNavigationProp,
  PreferenceStackParamList,
} from "../../../../navigators/PreferenceNavigator";
import { DevInfoScreen } from "./DevInfoScreen";
import { useNavigation } from "@react-navigation/native";

const PreferenceStack = createNativeStackNavigator<PreferenceStackParamList>();

/**
 * 어플리케이션 설정 화면 (네비게이터)
 */
function PreferenceScreen() {
  return (
    <View style={screens.defaultScreenLayout}>
      <PreferenceStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <PreferenceStack.Screen
          name="MainMenu"
          component={PreferenceMainMenuScreen}
        />
        <PreferenceStack.Screen name="DevInfo" component={DevInfoScreen} />
      </PreferenceStack.Navigator>
    </View>
  );
}

/**
 * 어플리케이션 설정 화면 (설정 메인메뉴)
 */
function PreferenceMainMenuScreen() {
  /** 로그아웃 기능 */
  const signOut = useSignOut();

  const preferenceNavigator = useNavigation<PreferenceStackNavigationProp>();

  const [preferenceMenuData, _] = useState<PreferenceMenuItemType[]>([
    {
      menuName: "로그아웃",
      onPress: signOut,
      iconName: "exit-to-app",
    },
    {
      menuName: "개발자 정보",
      onPress: useCallback(() => {
        preferenceNavigator.navigate("DevInfo");
      }, []),
      iconName: "info-outline",
    },
  ]);

  const handleRenderItem = useCallback(
    ({ item }: { item: PreferenceMenuItemType }) => {
      return <PreferenceMenuItem {...item} />;
    },
    []
  );

  return (
    <View style={screens.defaultScreenLayout}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={preferenceMenuData}
        renderItem={handleRenderItem}
        keyExtractor={(listItem) => listItem.menuName}
      />
    </View>
  );
}

function PreferenceMenuItem(props: PreferenceMenuItemType) {
  return (
    <Pressable onPress={props.onPress}>
      <View style={style.menuItemContainer}>
        <MaterialIcons style={style.menuItemText} name={props.iconName} />
        <Text style={style.menuItemText}>{props.menuName}</Text>
      </View>
    </Pressable>
  );
}

/** TBD 모달쪽 메뉴 아이템 코드와 통일시키기 */
interface PreferenceMenuItemType {
  menuName: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

/** TBD 스타일 코드 분리 */
const style = StyleSheet.create({
  menuItemContainer: {
    flex: 1,
    flexDirection: "row",
    borderWidth: Math.max(bFont.small / 8, 1),
    borderColor: bColors.white,
    borderBottomColor: bColors.greySecondary,
    paddingVertical: bSpace.xlarge,
    marginHorizontal: bSpace.xlarge,
    alignItems: "center",
  },
  menuItemText: {
    fontSize: bFont.large,
    marginRight: bSpace.large,
  },
});

export default PreferenceScreen;
