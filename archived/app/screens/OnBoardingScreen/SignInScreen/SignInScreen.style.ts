import { StyleSheet } from "react-native";
import { bColors, bFont, bSpace } from "../../../styles/base";

export const signInScreenStyle = StyleSheet.create({
  titleContainer: {
    flex: 0.7,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: bSpace.xlarge,
  },
  titleLogo: { resizeMode: "contain", maxHeight: 72 },
  bottomContainer: {
    flex: 1,
    marginHorizontal: bSpace.xlarge * 2,
    marginTop: bSpace.xlarge,
  },
  textInput: {
    fontSize: bFont.large,
    marginBottom: bSpace.large + bSpace.middle,
  },
});
