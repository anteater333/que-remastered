import { StyleSheet } from "react-native";
import { bColors, bFont, bSpace } from "../../../styles/base";

/** 비디오 업로드 화면 네비게이션 내부 스타일 모음 */
export const uploadScreenStyle = StyleSheet.create({
  // SelectTypeScreen
  largeButtonsContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: bSpace.xlarge * 2,
    paddingTop: bSpace.xlarge * 2,
    paddingBottom: bSpace.xlarge * 6,
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    textAlign: "center",
    fontSize: bFont.middle,
    color: bColors.primary,
  },
  largeButton: {
    alignItems: "center",
    justifyContent: "center",
    margin: bSpace.large,
  },
  largeButtonDisabled: {
    opacity: 0.3,
  },
  largeButtonIcon: {
    fontSize: bFont.xlarge * 10,
  },
  largeButtonText: {
    fontSize: bFont.xlarge,
  },
  seperation: {
    width: "100%",
    height: 1,
    backgroundColor: bColors.greySecondary,
    marginTop: bSpace.xlarge,
  },
  // InputDataScreen
  videoContainer: {
    backgroundColor: bColors.black,
    marginBottom: bSpace.xlarge,
    // TBD 현재 기기 화면 너비 구해서 9:16 비율 맞추기, 화면 너비는 base에 저장하기
    height: bSpace.xlarge * 15,
  },
  dataInputContainer: {
    paddingTop: bSpace.xlarge,
    paddingHorizontal: bSpace.xlarge,
  },
  dataInputLabel: {
    marginBottom: bSpace.small,
  },
  dataInputField: {
    marginBottom: bSpace.xlarge,
    fontSize: bFont.xlarge,
  },
});
