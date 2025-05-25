import { StatusBar } from "expo-status-bar";
import { StyleSheet, LogBox, SafeAreaView, Platform } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Entypo } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { bColors } from "./styles/base";
import RootScreen from "./screens/RootScreen";
import { useAuth } from "./hooks/useAuth";
import QueAuthClient from "./api/QueAuthUtils";
import { useNotice } from "./hooks/useNotice";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useSelector } from "react-redux";
import {
  initializeNoticeList,
  selectNoticeList,
} from "./reducers/noticeReducer";

/**
 * 어플리케이션 프로그램 최상단 컴포넌트, 엔트리 포인트
 * TBD: 최소한의 로직만 남겨두기
 */
export default function AppContainer() {
  const [appIsReady, setAppIsReady] = useState(false);
  /** 저장된 계정 정보가 있는지 확인 용도 */
  const { isSigned } = useAuth();

  const dispatch = useAppDispatch();

  /**
   * 빈 배열을 전달한 useEffect는 최초 렌더링에서만 실행된다.
   */
  useEffect(() => {
    /**
     * Splash screen 함수
     */
    async function prepare() {
      try {
        /** 리소스를 fetch하는 동안 splash를 보이게 하기 */
        await SplashScreen.preventAutoHideAsync();

        // 여기다가 원하는 API콜을 만들 수 있음
        /** 폰트 미리 로드 */
        await Font.loadAsync(Entypo.font);

        dispatch(initializeNoticeList({ noticeId: "ALPHA01" }));

        /** 자동 로그인 */
        if (isSigned) {
          await QueAuthClient.refreshUser();
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // 어플리케이션에게 준비됐다고 말하기
        setAppIsReady(true);
      }
    }

    // 함수 호출
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // 이 코드는 스플래시 화면이 바로 사라지게 만듬
      // 우리가 'setAppIsReady' 다음 호출하면
      // 앱이 미처 렌더링 되기 전의 빈 화면을 볼 수도 있음.
      // 그러니까 root view가 layout을 생성한 것을 인식한 다음 사라지게 하는게 좋다.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaView onLayout={onLayoutRootView} style={styles.rootContainer}>
      <NavigationContainer
        linking={{
          enabled: true,
          prefixes: ["https://localhost", "que://"],
        }}
      >
        <RootScreen isSigned={isSigned} />
      </NavigationContainer>
      <StatusBar
        translucent={false}
        style="auto"
        backgroundColor={bColors.transparent}
      />
    </SafeAreaView>
  );
}

/**
 * 최상위 컴포넌트에 대한 스타일
 */
const styles = StyleSheet.create({
  rootContainer: {
    width: "100%",
    flex: 1,
    maxWidth: Platform.OS === "web" ? 720 : undefined,
    shadowColor: bColors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 5,
  },
});
