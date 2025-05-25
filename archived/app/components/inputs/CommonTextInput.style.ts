import { StyleSheet } from "react-native";
import { bColors, bFont } from "../../styles/base";

const sharedStyle = {
  minHeight: bFont.xlarge,
  maxHeight: bFont.xlarge * 10,
};

const commonTextInputStyles = StyleSheet.create({
  default: {
    borderBottomWidth: 2,
    fontSize: bFont.xlarge,
    color: bColors.black,
    minHeight: sharedStyle.minHeight,
    maxHeight: sharedStyle.maxHeight,
  },
  valid: {
    borderColor: bColors.black,
  },
  invalid: {
    borderColor: bColors.red,
  },
  disabled: {
    borderColor: bColors.greyTetiary,
    color: bColors.greyPrimary,
  },
});

export const multiLineStyles = (
  contentHeight: string | number,
  maxHeight?: string | number,
  minHeight?: string | number
) => {
  minHeight = minHeight ? minHeight : sharedStyle.minHeight;
  maxHeight = maxHeight ? maxHeight : sharedStyle.maxHeight;

  contentHeight = contentHeight < maxHeight ? contentHeight : maxHeight;

  if (typeof minHeight == "number" && typeof contentHeight == "number")
    return StyleSheet.create({
      calculated: { height: Math.max(minHeight, contentHeight) },
    });
  else {
    return StyleSheet.create({
      calculated: { height: contentHeight },
    });
  }
};

export default commonTextInputStyles;
