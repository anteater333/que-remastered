import { useCallback } from "react";
import { Alert, Platform } from "react-native";

/**
 * 예, 아니요로 응답을 받을 수 있는 alert 창을 사용한다.
 */
export const useConfirm = () => {
  /** Native alert 창을 대기하도록 만드는 함수. */
  const asyncNativeAlert = (
    title: string,
    subTitle?: string
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        title,
        subTitle,
        [
          { text: "네", onPress: () => resolve(true) },
          { text: "아니요", onPress: () => resolve(false) },
        ],
        { cancelable: false }
      );
    });
  };

  return useCallback(
    async (title: string, subTitle?: string): Promise<boolean> => {
      if (Platform.OS === "web") {
        return confirm(title + (subTitle ? `\n${subTitle}` : ""));
      } else {
        return await asyncNativeAlert(title, subTitle);
      }
    },
    []
  );
};
