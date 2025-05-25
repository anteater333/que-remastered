import { useCallback } from "react";
import { Alert, Platform } from "react-native";
import { Toast } from "native-base";

/**
 * 아직 구현하지 못한 기능들에 대한 안내 메세지를 표출한다.
 * 굳이 이걸 분리하네
 */
export const useNotImplementedWarning = () => {
  return useCallback(() => {
    alert("개발 중입니다. 아직 알파 버전이라 미안해요.");
  }, []);
};
