import { Platform, StyleSheet } from "react-native";
import { bColors, bFont, bSpace } from "../../styles/base";

const sharedSize = bFont.xlarge;

/** MainScreenHeader용 스타일 */
export const mainScreenHeaderStyle = StyleSheet.create({
  default: {
    flexDirection: "row",
    height: 56,
    backgroundColor: bColors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: bSpace.xlarge,
    marginVertical: bSpace.middle,
  },
  titleText: {
    fontSize: bFont.large,
    paddingVertical: bSpace.middle,
    flex: 1,
  },
  titleLogo: {
    height: sharedSize,
    width: Math.ceil((sharedSize * 187) / 75), // 러프한 방법으로 로고 크기 지정 하였음
    resizeMode: "contain",
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: bSpace.xlarge,
  },
  headerButtonView: {
    marginLeft: bSpace.xlarge,
  },
  headerButtonIcon: {
    fontSize: sharedSize,
  },
  headerProfilePicSize: {
    fontSize: sharedSize + bFont.small,
  },
});

/** CommonHeader용 스타일 */
export const commonHeaderStyle = StyleSheet.create({
  default: {
    backgroundColor: bColors.white,
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButtonContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleLogo: {
    height: bFont.large * 2,
    resizeMode: "contain",
  },
  titleText: {
    fontSize: sharedSize,
  },
  roundedButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  roundedButton: {
    width: bSpace.large * 6,
    height: bFont.large * 2,
    fontSize: bFont.large,
    marginRight: bSpace.middle,
  },
});
