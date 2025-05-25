import { StyleSheet, TextStyle } from "react-native";
import { bColors, bFont, bSpace } from "../../styles/base";
import { Platform } from "react-native";

const sharedShadow = {
  shadowOpacity: 0.5,
  shadowRadius: 3,
  shadowOffset: {
    height: 1,
    width: 1,
  },
};

const socialLoginButtonStyles = StyleSheet.create({
  buttonContainer: {
    height: bFont.xlarge,
    width: bFont.xlarge,
    borderRadius: bFont.xlarge,
    ...Platform.select({
      web: sharedShadow,
      ios: sharedShadow,
    }),
    ...Platform.select({
      android: {
        elevation: 3,
      },
    }),
  },
  buttonPressable: {
    borderRadius: bFont.xlarge,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  buttonImage: {
    flex: 1,
    resizeMode: "contain",
  },
});

export default socialLoginButtonStyles;
