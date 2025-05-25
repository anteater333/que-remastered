import { StyleSheet } from "react-native";
import { bColors, bFont, bSpace } from "../../../styles/base";

export const signUpScreenStyle = StyleSheet.create({
  titleContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  titleLogo: { resizeMode: "contain", maxHeight: 72 },
  titleText: {
    fontWeight: "bold",
    fontSize: bFont.xlarge,
    marginTop: bSpace.middle,
    marginBottom: bSpace.xlarge,
  },
  bottomContainer: {
    flex: 1,
    marginTop: bSpace.middle,
    marginHorizontal: bSpace.xlarge * 2,
  },
  upperContainer: {
    flex: 1,
    marginHorizontal: bSpace.xlarge * 2,
  },
  textInput: {
    fontSize: bFont.large,
    marginTop: bSpace.large * 2,
  },
  textInputUpper: {
    fontSize: bFont.large,
    marginTop: bSpace.large,
  },
  textInputNickname: {
    marginTop: bSpace.xlarge,
    fontSize: bFont.xlarge,
    textAlign: "center",
  },
  messageText: {
    marginTop: bSpace.middle,
    fontSize: bFont.middle,
    color: bColors.black,
  },
  errorMessageText: {
    color: bColors.red,
  },
  messageTextButton: {
    color: bColors.primary,
  },
  textAlignCenter: {
    textAlign: "center",
  },
  textAlignRight: {
    textAlign: "right",
  },
  profileUploadButtonInside: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonContainer: {
    width: bFont.xlarge * 12,
    height: bFont.xlarge * 12,
    borderRadius: bFont.xlarge * 12,
    borderWidth: bFont.small,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  withImage: {
    borderColor: bColors.greyPrimary,
    borderWidth: 1,
    borderStyle: "solid",
  },
  uploadButtonIcon: {
    fontSize: bFont.xlarge * 8,
  },
  uploadButtonMessage: {
    fontSize: bFont.middle,
    marginTop: -bSpace.xlarge - bSpace.large,
  },
  uploadedImage: {
    resizeMode: "cover",
    height: bFont.xlarge * 12,
    width: bFont.xlarge * 12,
    borderRadius: bFont.xlarge * 12,
  },
});
