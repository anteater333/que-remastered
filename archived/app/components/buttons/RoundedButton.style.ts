import { StyleSheet, TextStyle } from "react-native";
import { bColors, bFont, bSpace } from "../../styles/base";
import { RoundedButtonProps } from "./RoundedButton";

/** 버튼 타입과 관계없는 기본 레이아웃에 대한 스타일 */
export const buttonLayoutStyles = StyleSheet.create({
  buttonBorder: { borderRadius: 4, overflow: "hidden" },
  buttonBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

/** 버튼 타입 별 색상 지정 */
const colorsetByTypes = {
  enabledBorder: {
    bgColor: bColors.white,
    bdColor: bColors.black,
    txColor: bColors.black,
  },
  enabledDark: {
    bgColor: bColors.black,
    bdColor: bColors.black,
    txColor: bColors.white,
  },
  disabled: {
    bgColor: bColors.white,
    bdColor: bColors.greyTetiary,
    txColor: bColors.greyTetiary,
  },
  primary: {
    bgColor: bColors.transparent,
    bdColor: bColors.transparent,
    txColor: bColors.white,
  },
  white: {
    bgColor: bColors.white,
    bdColor: bColors.white,
    txColor: bColors.black,
  },
  danger: {
    bgColor: bColors.red,
    bdColor: bColors.red,
    txColor: bColors.white,
  },
};
/** 버튼 타입등 프로퍼티에 영향을 받는 스타일 */
export const buttonInsideStyles = (props: RoundedButtonProps) => {
  const colorSet = colorsetByTypes[props.buttonType!];
  /** 상속된 텍스트 스타일 or 기본 텍스트 스타일 */
  const inheritedStyle: TextStyle = props.style
    ? (props.style as TextStyle)
    : { fontSize: bFont.middle, fontWeight: "normal" };

  const rtStyle = {
    ...StyleSheet.create({
      buttonInside: {
        backgroundColor: colorSet.bgColor,
        alignItems: props.iconData?.withText ? "flex-start" : "center",
        justifyContent: "center",
        borderRadius: 4,
        width: "100%",
        height: "100%",
        borderWidth: bSpace.small / 2,
        borderColor: colorSet.bdColor,
      },
      buttonImage: {
        height: props.iconData?.iconSize
          ? props.iconData.iconSize
          : inheritedStyle.fontSize,
        width: props.iconData?.iconSize
          ? props.iconData.iconSize
          : inheritedStyle.fontSize,
        alignSelf: "center",
      },
      buttonIcon: {
        fontSize: props.iconData?.iconSize
          ? props.iconData.iconSize
          : inheritedStyle.fontSize,
      },
      buttonText: {
        textAlign: "center",
        color: colorSet.txColor,
        fontSize: inheritedStyle.fontSize,
        fontWeight: props.bold ? "bold" : inheritedStyle.fontWeight,
      },
      gradientBackground: {
        position: "absolute",
        width: "100%",
        height: "100%",
      },
      verticalLine: {
        alignSelf: "center",
        height: "80%",
        width: 1,
        backgroundColor: colorSet.txColor,
      },
      rowFlexContainer: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
      },
      rowFlexItem: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: bSpace.small,
      },
      rowFlexIcon: {},
      rowFlexText: {
        width: "100%",
        flex: 1,
      },
    }),
    primaryGradient: {
      colors: [bColors.tetiary, bColors.primary],
      start: { x: 0, y: 1 },
      end: { x: 1, y: 0 },
    },
  };

  return rtStyle;
};
