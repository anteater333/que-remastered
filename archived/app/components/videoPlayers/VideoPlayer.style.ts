import { Platform, StyleSheet, ViewStyle } from "react-native";
import { bColors, bDimensions, bFont, bSpace } from "../../styles/base";

const videoHeartIconSIze = bFont.xlarge;

const videoPlayerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoCoreContainer: {
    flex: 1,
  },
  videoCore: {
    flex: 1,
    justifyContent: "center",
  },
  videoControllerView: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  videoTransparentPressableArea: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 0,
    elevation: 0,
  },
  videoDarkOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: bColors.black + bColors.tpTetiary,
    zIndex: 0,
    elevation: 0,
  },
  videoUpperControllerContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    // TBD 그라데이션 오버레이
  },
  videoInfoContainer: {
    padding: bSpace.xlarge,
  },
  videoInfoRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: bSpace.middle,
  },
  videoInfoColor: {
    color: bColors.white + bColors.tpPrimary,
  },
  videoInfoText: {
    fontSize: bFont.middle,
  },
  videoTitleText: {
    fontSize: bFont.xlarge + bFont.middle,
    maxWidth: bFont.xlarge * 8,
  },
  videoUploaderText: {
    fontSize: bFont.large,
    textAlignVertical: "center",
  },
  videoDescriptionContainer: {
    height: bFont.middle * 8,
  },
  videoDescriptionText: {
    fontSize: bFont.middle,
  },
  videoReactionContainer: {
    flex: 1,
    paddingTop: bSpace.middle,
  },
  videoReactionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  videoReactionText: {
    fontSize: bFont.middle,
    minWidth: bFont.middle * 2,
    textAlign: "right",
  },
  videoReactionItem: {
    marginLeft: bSpace.middle,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  videoMiddleControllerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoBufferIndicator: {
    fontSize: bFont.xlarge * 5,
    color: bColors.white + bColors.tpPrimary,
  },
  videoBigButton: {
    paddingTop: bFont.large,
    height: bFont.xlarge * 6,
    lineHeight: bFont.xlarge * 6, // 이모티콘이 중간에 오도록 만듭니다.
  },
  videoMiddleButtonContainer: {
    flexDirection: "row",
    paddingTop: bSpace.large * 5,
  },
  videoMiddleDummyArea: {
    height: bSpace.xlarge * 8,
  },
  videoMiddleButtonSpace: {
    width: bSpace.xlarge * 6,
  },
  videoMiddleButton: {
    fontSize: bFont.large * 4,
  },
  videoMiddleButtonText: {
    color: bColors.white + bColors.tpPrimary,
    textAlign: "center",
    fontSize: bFont.large,
  },
  videoBottomControllerContainer: {
    flexDirection: "row",
    width: "100%",
    paddingBottom: bSpace.middle,
    paddingHorizontal: bSpace.xlarge,
    alignItems: "flex-end",
    overflow: "visible",
  },
  videoSmallButton: {
    height: bFont.xlarge,
    lineHeight: bFont.xlarge, // 이모티콘이 중간에 오도록 만듭니다.
  },
  videoSliderContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "flex-end",
    marginHorizontal: bSpace.middle,
    overflow: "visible",
  },
  videoSlider: {
    overflow: "visible",
  },
  videoHeartArea: {
    height: bFont.xlarge * 1.5,
    overflow: "visible",
    width: "100%",
  },
  videoHeartIndicatorContainer: {
    position: "absolute",
    bottom: Platform.OS === "web" ? 0 : bSpace.small,
    width: videoHeartIconSIze * 2,
    height: videoHeartIconSIze * 2,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "visible",
    zIndex: 100,
    elevation: Platform.OS === "android" ? 50 : 0,
  },
  videoHeartIndicatorText: {
    color: bColors.white + bColors.tpPrimary,
    fontSize: bFont.small,
    textAlign: "center",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: bFont.small * 4,
    // height: bFont.small * 2,
  },
  videoHeartIndicatorIcon: {
    color: bColors.red + bColors.tpPrimary,
    fontSize: bFont.large,
  },
  videoHeartIndicatorEmpty: {
    height: bSpace.large * 2,
  },
});

export default videoPlayerStyles;

/**
 * 좋아요 위치, 영상 길이, 슬라이더 컴포넌트의 길이를 통해
 * 하트 모양 아이콘의 위치를 결정하는 함수
 */
export const heartPositionBuilder = (
  likedPosition: number,
  videoLength: number,
  sliderWidth: number
) => {
  // 웹과 모바일 슬라이더 크기가 약간 다릅니다.
  /** 하트 컴포넌트의 위치 계산 */
  const heartPosition =
    (Platform.OS === "web"
      ? (likedPosition * (sliderWidth - videoHeartIconSIze)) / videoLength
      : videoHeartIconSIze / 2.5 +
        (likedPosition * (sliderWidth - videoHeartIconSIze * 2)) /
          videoLength) -
    videoHeartIconSIze / 2;

  return StyleSheet.create({
    style: {
      left: heartPosition,
    },
  }).style;
};

export const sliderStyle = StyleSheet.create({
  default: {
    color: bColors.secondary,
    tintColor: bColors.primary,
  },
});

export const iconStyles = {
  color: bColors.white + bColors.tpPrimary,
  heartColor: bColors.red + bColors.tpPrimary,
  sizeLarge: bFont.large,
  sizeXlarge: bFont.xlarge,
  sizeXXlarge: bFont.xlarge * 6,
};
