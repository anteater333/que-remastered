import { StyleSheet, LogBox } from "react-native";
import React from "react";
import { bColors } from "./app/styles/base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider } from "native-base";
import { Provider } from "react-redux";
import store, { persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import AppContainer from "./app/AppContainer";
import { LoadingIndicatorProvider } from "./app/hooks/useLoadingIndicator";

// 타이머 경고 무효
LogBox.ignoreLogs(["Setting a timer"]);

/**
 * 어플리케이션 프로그램 최상단 컴포넌트, 엔트리 포인트
 */
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NativeBaseProvider>
          <SafeAreaProvider style={styles.rootBackground}>
            <LoadingIndicatorProvider>
              <AppContainer />
            </LoadingIndicatorProvider>
          </SafeAreaProvider>
        </NativeBaseProvider>
      </PersistGate>
    </Provider>
  );
}

/**
 * 최상위 컴포넌트에 대한 스타일
 */
const styles = StyleSheet.create({
  rootBackground: {
    flex: 1,
    backgroundColor: bColors.white,
    alignItems: "center",
  },
});
