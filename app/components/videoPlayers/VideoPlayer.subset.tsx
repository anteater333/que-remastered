// VideoPlayer.subset.tsx
/**
 * 비디오 플레이어에 공통적으로 사용되는 하위 컴포넌트들의 모음집입니다.
 */

import {
  ActivityIndicator,
  Animated,
  LayoutChangeEvent,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styles, {
  heartPositionBuilder,
  iconStyles,
  sliderStyle,
} from "./VideoPlayer.style";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import VideoType from "../../types/Video";
import { useCallback, useEffect, useRef, useState } from "react";
import { HEART_COLOR_TIMER } from "./VideoPlayer.global";
import LikeType from "../../types/Like";
import { formatTimer } from "../../utils/formatter";
import MenuModal, { MenuModalItem } from "../modals/MenuModal";
import { useToggleTimer } from "../../hooks/useTimer";

/** 비디오 플레이어 프로퍼티 타입 */
export interface VideoPlayerProps {
  /** 이 프로퍼티에서는 비디오 메타 정보만 사용합니다. 비디오 원본 주소는 videoSource 프로퍼티로 전달해야 합니다. */
  videoData: VideoType;
  /** 비디오 원본 주소 입니다. */
  videoSource: string;
}

/** 중앙 버튼 */
export function VideoMiddleController(props: {
  isBuffering: boolean;
  isControlHidden: boolean;
  togglePlay: () => void;
  isPlaying: boolean;
  didJustFinish: boolean;
}) {
  return (
    <>
      {props.isBuffering ? (
        <ActivityIndicator
          size={styles.videoBufferIndicator.fontSize}
          color={styles.videoBufferIndicator.color}
          style={styles.videoBigButton}
        />
      ) : !props.isControlHidden ? (
        <View>
          <Pressable onPress={props.togglePlay}>
            <MaterialIcons
              style={styles.videoBigButton}
              selectable={false}
              color={iconStyles.color}
              size={iconStyles.sizeXXlarge}
              name={
                props.isPlaying
                  ? "pause"
                  : props.didJustFinish
                  ? "replay"
                  : "play-arrow"
              }
            />
          </Pressable>
        </View>
      ) : null}
    </>
  );
}

/** 애니메이션 적용 가능한 MaterialIcons 컴포넌트, 추후 코드 분리 필요 */
const AnimatedMaterialIcon = Animated.createAnimatedComponent(MaterialIcons);

type VideoLikeType =
  | { useLikes?: false }
  | {
      /** 좋아요 기능 사용 여부 */
      useLikes: true;
      /** 좋아요 API 호출 */
      onLike: () => Promise<void>;
      /** 좋아요 취소 API 호출 */
      onDislike: (likeData: LikeType) => Promise<void>;
      /** 좋아요 데이터들 */
      likesData: LikeType[];
      /** 좋아요 개수 제한 도달 여부 */
      noMoreLike?: boolean;
    };

type VideoBottomControllerPropType = {
  togglePlay: () => void;
  isPlaying: boolean;
  didJustFinish: boolean;
  videoPosition: number;
  videoLength: number;
  seekVideo: (position: number) => void;
} & VideoLikeType;

/** 하단 재생바, 좋아요 기능 포함! */
export function VideoBottomController(props: VideoBottomControllerPropType) {
  // TBD Web 대응 마우스 호버시에만 컨트롤러 표시되도록 만들기

  /** 디바운싱을 위한 버튼 사용 가능 상태 */
  const [likable, setLikable] = useState<boolean>(true);

  /** 재생바의 너비 */
  const [sliderWidth, setSliderWidth] = useState<number>(0);

  /** 재생바의 너비 구하는 함수 (반응형) */
  const getSliderWidth = useCallback((event: LayoutChangeEvent) => {
    setSliderWidth(event.nativeEvent.layout.width);
  }, []);

  /** 버튼 색상 변경 애니메이션 재료들 */
  const animation = useRef(new Animated.Value(0)).current;
  const colorFadeInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [iconStyles.color, iconStyles.heartColor],
  });

  /** likable 디바운싱 타이머 */
  const refreshLikableTimer = useToggleTimer(
    setLikable,
    true,
    HEART_COLOR_TIMER * 2
  );

  /** 좋아요 개수 제한에 도달했을 경우 더 좋아요 요청할 수 없도록 하기 */
  useEffect(() => {
    if (props.useLikes) {
      refreshLikableTimer();
      setLikable(!props.noMoreLike);
    }
  }, [props.useLikes, props.useLikes ? props.noMoreLike : undefined]);

  /** 좋아요 가능 여부에 따라 버튼 색상 변경 */
  useEffect(() => {
    if (likable) {
      Animated.timing(animation, {
        toValue: 0,
        duration: HEART_COLOR_TIMER,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 1,
        duration: HEART_COLOR_TIMER,
        useNativeDriver: false,
      }).start();
    }
  }, [likable, animation]);

  /** 버튼 터치 시 색상 변경 fade 애니메이션 사용, 색상이 다 사라져야지 좋아요 할 수 있음 */
  const handleButtonDebouncing = useCallback(() => {
    setLikable(false);
    refreshLikableTimer({ updateNewTimer: true });
  }, []);

  /** 우측 좋아요 버튼 눌렀을 때의 액션 설정, 디바운싱 처리됨 */
  const handleLikeBottonPressed = useCallback(async () => {
    if (likable && props.useLikes) {
      handleButtonDebouncing();
      await props.onLike();
    } else if (props.useLikes && props.noMoreLike) {
      // TBD 좋아요 개수 제한에 대해 설명하든 아니면 그냥 아무 리액션 하지 않든
    }
  }, [likable, props.useLikes, props.useLikes ? props.noMoreLike : undefined]);

  /** 좋아요 위치 목록 */
  let heartIndicators = null;
  if (props.useLikes) {
    heartIndicators = props.likesData.map((like, index) => {
      // TBD index를 key로 사용하지 않도록 만들기 (likeId 등을 사용하던가 해서)
      // https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318
      return (
        <SliderHeartIndicator
          key={index}
          isPlaying={props.isPlaying}
          likeData={like}
          sliderWidth={sliderWidth}
          videoLength={props.videoLength}
          onDislike={props.onDislike}
        />
      );
    });
  }

  return (
    <TouchableWithoutFeedback>
      <View style={styles.videoBottomControllerContainer}>
        <Pressable onPress={props.togglePlay}>
          <MaterialIcons
            style={styles.videoSmallButton}
            selectable={false}
            color={iconStyles.color}
            size={iconStyles.sizeXlarge}
            name={
              props.isPlaying
                ? "pause"
                : props.didJustFinish
                ? "replay"
                : "play-arrow"
            }
          />
        </Pressable>
        <View onLayout={getSliderWidth} style={styles.videoSliderContainer}>
          {props.useLikes ? (
            <View style={styles.videoHeartArea}>
              {/* 좋아요 표시 컴포넌트들 */}
              {heartIndicators}
            </View>
          ) : null}
          <Slider
            style={styles.videoSlider}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={sliderStyle.default.color}
            maximumTrackTintColor={sliderStyle.default.color}
            thumbTintColor={sliderStyle.default.tintColor}
            value={props.videoPosition / props.videoLength}
            onSlidingComplete={props.seekVideo}
          />
        </View>
        {props.useLikes ? (
          <Pressable onPress={handleLikeBottonPressed}>
            <AnimatedMaterialIcon
              style={[
                styles.videoSmallButton,
                { color: colorFadeInterpolation },
              ]}
              size={iconStyles.sizeXlarge}
              selectable={false}
              name={"favorite"}
            />
          </Pressable>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

/** 영상 내부에서 좋아요 한 위치를 표시하는 컴포넌트 */
function SliderHeartIndicator(props: {
  likeData: LikeType;
  videoLength: number;
  sliderWidth: number;
  isPlaying: boolean;
  onDislike: (likeData: LikeType) => Promise<void>;
}) {
  /** 터치 문제 해결하기 전 까지 modal 사용 */
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleDislike = useCallback(async () => {
    setModalVisible(false);
    await props.onDislike(props.likeData);
  }, [props.likeData]);

  return (
    <Pressable
      style={[
        styles.videoHeartIndicatorContainer,
        heartPositionBuilder(
          props.likeData.likePosition!,
          props.videoLength,
          props.sliderWidth
        ),
      ]}
      onPress={() => {
        setModalVisible(true);
      }}
    >
      <MenuModal visible={modalVisible} setModalVisible={setModalVisible}>
        <MenuModalItem
          iconName="heart-dislike"
          menuText="좋아요 취소"
          onMenuPress={handleDislike}
        />
      </MenuModal>
      {props.isPlaying ? (
        <View style={styles.videoHeartIndicatorEmpty}></View>
      ) : (
        <Text
          selectable={false}
          numberOfLines={1}
          style={styles.videoHeartIndicatorText}
        >
          {formatTimer(props.likeData.likePosition!)}
        </Text>
      )}
      <MaterialIcons
        selectable={false}
        style={styles.videoHeartIndicatorIcon}
        name="favorite"
      />
    </Pressable>
  );
}
