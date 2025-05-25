import { StyleSheet } from "react-native";
import { bColors, bFont, bSpace } from "../../styles/base";

/**
 * 메뉴 모달에서 포함하는 컴포넌트들의 스타일 객체
 */
const menuModalStyles = StyleSheet.create({
  menuModalView: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: bColors.white,
    bottom: bSpace.small / 2,
    width: "100%",
    maxWidth: 280,
    borderRadius: 10,
    paddingHorizontal: bSpace.small,
  },
  modalSwipeIndicator: {
    height: bSpace.xlarge + bFont.small,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSwipeHandle: {
    backgroundColor: bColors.greyTetiary,
    width: 40,
    height: 4,
  },
  menuModalChildrenContainer: {
    width: "100%",
  },
  menuModalItemContainer: {
    flexDirection: "column",
  },
  menuModalItemFlexBox: {
    flexDirection: "row",
    width: "100%",
    marginBottom: bSpace.large,
  },
  menuModalItemFlexItem: {
    marginLeft: bSpace.xlarge,
  },

  noticeModalView: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: bColors.white,
    width: "90%",
    maxWidth: 560,
    height: "80%",
    borderRadius: 10,
    paddingHorizontal: bSpace.middle,
    overflow: "hidden",
  },
  noticeModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: bSpace.middle * 5,
    width: "100%",
  },
  noticeModalBody: {
    flex: 1,
    width: "100%",
  },
  noticeModalBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: bSpace.middle * 5,
    width: "100%",
  },
  noticeModalIcon: {
    fontSize: bFont.xlarge,
  },
  noticeModalButtonEnabled: {
    color: bColors.black,
  },
  noticeModalButtonDisabled: {
    color: bColors.greyTetiary,
  },
});

export default menuModalStyles;
