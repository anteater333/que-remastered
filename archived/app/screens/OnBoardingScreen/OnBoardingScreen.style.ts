import { StyleSheet } from "react-native";
import { bColors, bFont, bSpace } from "../../styles/base";

export const styles = StyleSheet.create({
  contextContainer: {
    flexGrow: 0.1,
    marginHorizontal: bSpace.xlarge * 2,
  },
  catchPhraseContainer: {
    paddingTop: bSpace.large,
  },
  catchPhraseText: {
    fontWeight: "bold",
    fontSize: bFont.xlarge + bFont.middle,
    color: bColors.white,
  },
  buttonContainer: {
    paddingTop: bSpace.xlarge + bSpace.middle,
  },
  signInSuggestionText: { color: bColors.white, fontSize: bFont.middle },
  signInButtonText: { color: bColors.primary },
});
