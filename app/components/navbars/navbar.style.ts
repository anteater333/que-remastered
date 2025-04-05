import { StyleSheet } from "react-native";
import { bColors, bFont, bSpace } from "../../styles/base";

/** VideoCard 컴포넌트에 적용될 스타일 */
const navBarStyle = StyleSheet.create({
  default: {
    height: 56,
    backgroundColor: bColors.white,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderTopColor: bColors.greyTetiary,
    borderTopWidth: 1,
    paddingHorizontal: bSpace.xlarge + bSpace.middle,
  },
  buttonTouchableArea: {
    flex: 1,
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: bSpace.small,
  },
  uploadButtonImage: {
    height: bFont.xlarge * 2,
  },
  buttonFont: {
    fontSize: bFont.small,
    color: bColors.black,
  },
  buttonFontSelected: {
    fontSize: bFont.small,
    color: bColors.primary,
  },
  wizardNavBarContainer: {
    paddingHorizontal: bSpace.xlarge,
    justifyContent: "space-between",
  },
  wizardButtonContainer: {
    width: bSpace.large * 6,
    height: bFont.large * 2,
  },
  wizardButton: {
    flex: 1,
  },
  skipButton: {
    fontSize: bFont.middle,
  },
  nextButton: {
    fontSize: bFont.large,
  },
});

export default navBarStyle;

/**
 * StyleSheet로 wrapping 할 필요 없는 스타일 수치
 */
export const iconStyles = {
  buttonIcon: {
    fontSize: bFont.xlarge,
    color: bColors.black,
  },
  buttonIconSelected: {
    color: bColors.primary,
  },
};
