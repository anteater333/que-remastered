import { StyleSheet } from "react-native";
import { bColors, bDimensions, bFont, bSpace } from "../../styles/base";

const videoCardListStyles = StyleSheet.create({
  cardListConatiner: {
    backgroundColor: bColors.white,
  },
  indicatorContainer: {
    margin: bSpace.large,
    alignItems: "center",
    justifyContent: "center",
  },
  noMoreDataImage: {
    opacity: 0.25,
    height: 36,
  },
  easterMessage: {
    opacity: 0.25,
    color: bColors.black,
    fontSize: bFont.small,
    marginTop: bSpace.middle,
  },
});

export default videoCardListStyles;
