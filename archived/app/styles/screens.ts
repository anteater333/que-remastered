import { StyleSheet } from "react-native";
import { bColors } from "./base";

/** 스크린 단위 공통 스타일 클래스 */
export default StyleSheet.create({
  /**
   * 화면 전체를 커버하는 스크린 크기
   */
  defaultScreenLayout: {
    flex: 1,
    backgroundColor: bColors.white,
  },
});
