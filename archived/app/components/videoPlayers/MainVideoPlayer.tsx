import { AVPlaybackStatus, Video } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import styles, { iconStyles } from "./VideoPlayer.style";
import {
  VideoBottomController,
  VideoMiddleController,
  VideoPlayerProps,
} from "./VideoPlayer.subset";
import { MaterialIcons } from "@expo/vector-icons";
import { useToggleTimer } from "../../hooks/useTimer";
import { INFO_HIDE_TIMER } from "./VideoPlayer.global";
import { formatCount, formatDate } from "../../utils/formatter";
import QueResourceClient from "../../api/QueResourceUtils";
import LikeType from "../../types/Like";
import { MAX_VIDEO_LIKE_LIMIT } from "../../api/interfaces";
import { useToast } from "native-base";
import UserType from "../../types/User";
import { useNotImplementedWarning } from "../../hooks/useWarning";
import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { MainStackNavigationProp } from "../../navigators/MainNavigator";

/** 조작하지 않을 시 컨트롤러 사라지는 시간 */
const CONTROL_HIDE_TIMER = 2000;

/**
 * 간소화된 비디오 플레이어 컴포넌트 입니다.
 * 화면의 전체를 덮지 않고 다른 UI 컴포넌트와 함께 사용될 필요가 있을 때 사용합니다.
 * TBD 전반적인 터치 액션 강화 (ex 10초 앞 뒤 건너뛰기)
 */
function MainVideoPlayer(props: VideoPlayerProps) {
  // TBD SimplifiedVideoPlayer와 공통 코드 분리
  const videoPlayer = useRef<Video>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [didJustFinish, setDidJustFinish] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [videoPosition, setVideoPosition] = useState<number>(0);
  const [videoLength, setVideoLength] = useState<number>(1);
  // const [videoPlayableBuffer, setVideoPlayableBuffer] = useState<number>(0);
  const [isControlHidden, setIsControlHidden] = useState<boolean>(false);
  const [isInfoHidden, setIsInfoHidden] = useState<boolean>(false);

  /** 현재 로그인한 사용자의 영상인지 확인 */
  const [isMyVideo, setIsMyVideo] = useState<boolean>(false);
  const { user } = useAuth();
  useEffect(() => {
    if (user.userId === (props.videoData.uploader as UserType).userId) {
      setIsMyVideo(true);
    } else {
      setIsMyVideo(false);
    }
  }, [user.userId, props.videoData.uploader]);

  /** 에러 표시용 */
  const toast = useToast();

  /** 영상이 끝나면 재생 버튼 표시하기 */
  useEffect(() => {
    if (didJustFinish) {
      setIsControlHidden(false);
      setIsInfoHidden(false);
    }
  }, [didJustFinish]);

  /** 영상 재생 상태 변화에 따른 처리 */
  const handleOnPlaybackStatusUpdate = useCallback(
    (playbackStatus: AVPlaybackStatus) => {
      if (!playbackStatus.isLoaded) {
        if (playbackStatus.error) {
          // TBD error 처리
          console.error(playbackStatus.error);
        }
      } else {
        setIsLoaded(playbackStatus.isLoaded);
        setIsPlaying(playbackStatus.isPlaying);
        setDidJustFinish(playbackStatus.didJustFinish);
        setIsBuffering(playbackStatus.isBuffering);
        setVideoPosition(playbackStatus.positionMillis);
        if (playbackStatus.durationMillis)
          setVideoLength(playbackStatus.durationMillis);
        // if (playbackStatus.playableDurationMillis) {
        //   // TBD 버퍼링 정도도 보여줄 수 있는 slider 구현
        //   setVideoPlayableBuffer(playbackStatus.playableDurationMillis);
        // }
      }
    },
    []
  );

  /** 영상 Seekbar 사용 함수 */
  const seekVideo = useCallback(
    (position) => {
      if (isLoaded) {
        videoPlayer.current?.setPositionAsync(videoLength * position);
      }
    },
    [videoLength, isLoaded]
  );

  /** 오버레이 숨김 처리 타이머 활성화 / 비활성화 함수 */
  const refreshHidingControlTimer = useToggleTimer(
    setIsControlHidden,
    true,
    CONTROL_HIDE_TIMER
  );

  /** 영상 설명 숨김 처리 타이머 할성화 / 비활성화 함수 */
  const refreshHidingInfoTimer = useToggleTimer(
    setIsInfoHidden,
    true,
    INFO_HIDE_TIMER
  );

  /** 오버레이 표시 상태에서 오버레이 영역 터치 시 오버레이 지우기 */
  const clearOverlay = useCallback(() => {
    if (!isControlHidden) {
      refreshHidingControlTimer();
      refreshHidingInfoTimer();
      setIsControlHidden(true);
      setIsInfoHidden(true);
    }
  }, [isControlHidden]);

  /** 오버레이 비표시 상태에서 비디오 영역 터치 시 오버레이 표시하기 */
  const displayOverlay = useCallback(() => {
    if (isControlHidden) {
      refreshHidingControlTimer({ updateNewTimer: isPlaying });
      refreshHidingInfoTimer({ updateNewTimer: isPlaying });
      setIsControlHidden(false);
      setIsInfoHidden(false);
    }
  }, [isControlHidden, isPlaying]);

  /** 재생 / 정지 토글 함수 */
  const togglePlay = useCallback(() => {
    // TBD Web에서 좀 더 우아하게 컨트롤 표시 처리하기
    // 차라리 웹 전용 컴포넌트를 만드는게 더 유리할수도(장기계획)
    if (isLoaded) {
      refreshHidingControlTimer({ updateNewTimer: !isPlaying });
      refreshHidingInfoTimer({ updateNewTimer: !isPlaying });
      if (isPlaying) {
        videoPlayer.current?.pauseAsync();
      } else {
        if (didJustFinish) {
          videoPlayer.current?.setPositionAsync(0);
        }
        videoPlayer.current?.playAsync();
      }
    }
  }, [isPlaying, isLoaded, didJustFinish, videoPlayer]);

  /** 영상 정보 표시 영역의 표시를 계속 유지한다. */
  const sustainInfoView = useCallback(() => {
    if (isPlaying) {
      refreshHidingInfoTimer({ updateNewTimer: true });
    }
  }, [isPlaying]);

  // 좋아요 관련 기능 영역

  /** 좋아요 데이터 묶음 */
  const [likeDataArray, setLikeDataArray] = useState<LikeType[]>([]);
  /** 좋아요 추가 가능 여부 */
  const [noMoreLike, setNoMoreLike] = useState<boolean>(false);

  // 영상 수정 관련 기능 영역
  /** 네비게이션 객체 사용 */
  const navigation = useNavigation<MainStackNavigationProp>();
  const handleOnEditPressed = useCallback(() => {
    navigation.navigate("VideoEdit", { videoData: props.videoData });
  }, [props.videoData]);

  // 아직 미구현 표시
  const notImplemented = useNotImplementedWarning();

  /** 좋아요 버튼 터치 시 API 호출 함수 */
  // TBD 좋아요 / 좋아요 취소 시 화면상의 좋아요 개수 반영하기, (숫자 증감, 좋아요 개수를 state로 만들기)
  const likeThisVideo = useCallback(async () => {
    if (props.videoData.videoId && !noMoreLike) {
      // videoPosition status를 사용하면 즉각적으로 위치가 업데이트 되지 않습니다.
      // 따라서 videoPlayer ref를 사용해서 데이터를 가져옵니다.
      // 성능을 일부 포기하고 기능을 구현했다고 생각하면 될듯합니다.
      const videoStatus = await videoPlayer.current?.getStatusAsync();
      const likePosition = videoStatus?.isLoaded
        ? videoStatus.positionMillis
        : 0;
      const result = await QueResourceClient.likeVideo(
        props.videoData.videoId,
        likePosition
      );

      if (result.success && result.payload) {
        setLikeDataArray(result.payload);
      } else {
        toast.show({
          description: `좋아요 중 문제가 발생했습니다. ${result.errorType}`,
        });
      }
    }
  }, [videoPosition, props.videoData, videoPlayer, noMoreLike]);

  /** 좋아요 버튼 취소 API 호출 함수 */
  const dislikeThisVideo = useCallback(async (likeData: LikeType) => {
    const result = await QueResourceClient.dislikeVideo(
      likeData.targetId!,
      likeData.likeId!
    );

    if (result.success) {
      setLikeDataArray(result.payload!);
    } else {
      toast.show({
        description: `좋아요 취소 중 문제가 발생했습니다. ${result.errorType}`,
      });
    }
  }, []);

  /** 화면 최초 로드 시 영상 데이터 불러오기 */
  useEffect(() => {
    const getLikes = async () => {
      const rt = await QueResourceClient.getMyLikeReactions(
        "video",
        props.videoData.videoId!
      );

      if (rt.success) setLikeDataArray(rt.payload!);
      else {
        console.error(rt.errorType);
      }
    };

    getLikes();
  }, []);

  /** 좋아요 개수 제한 */
  useEffect(() => {
    if (likeDataArray.length >= MAX_VIDEO_LIKE_LIMIT) {
      setNoMoreLike(true);
    } else {
      setNoMoreLike(false);
    }
  }, [likeDataArray]);

  // 렌더링 영역
  return (
    <View style={styles.container}>
      <View style={styles.videoCoreContainer}>
        <Video
          style={styles.videoCore}
          source={{ uri: props.videoSource }}
          ref={videoPlayer}
          resizeMode="contain"
          onPlaybackStatusUpdate={handleOnPlaybackStatusUpdate}
        />
      </View>
      {/* 비디오 영역 터치 대응 */}
      <Pressable
        onPress={displayOverlay}
        style={styles.videoTransparentPressableArea}
      />
      {/* 어둡게 오버레이 */}
      {!isControlHidden ? (
        <Pressable onPress={clearOverlay} style={styles.videoDarkOverlay} />
      ) : null}
      <View onTouchStart={sustainInfoView} style={styles.videoControllerView}>
        {/* 상단 영역 (영상 정보) */}
        {!isInfoHidden ? (
          <View style={styles.videoUpperControllerContainer}>
            <View style={styles.videoInfoContainer}>
              <View style={styles.videoInfoRow}>
                <Text
                  numberOfLines={1}
                  style={[styles.videoTitleText, styles.videoInfoColor]}
                >
                  {props.videoData.title ? props.videoData.title : "Untitled"}
                </Text>
                <View style={styles.videoReactionContainer}>
                  <View style={styles.videoReactionRow}>
                    <View style={styles.videoReactionItem}>
                      <MaterialIcons
                        name="favorite-border"
                        color={iconStyles.color}
                        size={iconStyles.sizeLarge}
                        style={styles.videoReactionItem}
                      />
                      <Text
                        style={[
                          styles.videoReactionText,
                          styles.videoInfoColor,
                          styles.videoReactionItem,
                        ]}
                      >
                        {props.videoData.likeCount
                          ? formatCount(props.videoData.likeCount)
                          : 0}
                      </Text>
                    </View>
                    <View style={styles.videoReactionItem}>
                      <MaterialIcons
                        name="star-border"
                        color={iconStyles.color}
                        size={
                          iconStyles.sizeLarge +
                          2 /** 이 아이콘만 묘하게 크기가 작아요 */
                        }
                        style={styles.videoReactionItem}
                      />
                      <Text
                        style={[
                          styles.videoReactionText,
                          styles.videoInfoColor,
                          styles.videoReactionItem,
                        ]}
                      >
                        {props.videoData.starCount
                          ? formatCount(props.videoData.starCount)
                          : 0}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.videoReactionRow}>
                    <Text
                      style={[
                        styles.videoReactionText,
                        styles.videoInfoColor,
                        styles.videoReactionItem,
                      ]}
                    >
                      Views
                    </Text>
                    <Text
                      style={[
                        styles.videoReactionText,
                        styles.videoInfoColor,
                        styles.videoReactionItem,
                      ]}
                    >
                      {props.videoData.viewCount
                        ? formatCount(props.videoData.viewCount)
                        : 0}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.videoInfoRow}>
                <Text style={[styles.videoInfoText, styles.videoInfoColor]}>
                  {props.videoData.song
                    ? props.videoData.song.title
                    : "곡 정보 없음"}
                </Text>
                <Text style={[styles.videoInfoText, styles.videoInfoColor]}>
                  {props.videoData.uploadedAt
                    ? formatDate(props.videoData.uploadedAt)
                    : "0000-00-00"}
                </Text>
              </View>
              <View style={styles.videoInfoRow}>
                <Text style={[styles.videoUploaderText, styles.videoInfoColor]}>
                  {(props.videoData.uploader as UserType).nickname
                    ? (props.videoData.uploader as UserType).nickname
                    : "placeholderUser"}
                </Text>
                {isMyVideo ? (
                  <Pressable onPress={handleOnEditPressed}>
                    <MaterialIcons
                      selectable={false}
                      name="create"
                      color={iconStyles.color}
                      size={iconStyles.sizeXlarge}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      // TBD 팔로우 기능
                      notImplemented();
                    }}
                  >
                    <MaterialIcons
                      selectable={false}
                      name="person-add"
                      color={iconStyles.color}
                      size={iconStyles.sizeXlarge}
                    />
                  </Pressable>
                )}
              </View>
              <View style={styles.videoInfoRow}>
                {/* {TBD 더보기 누르면 description 표시} */}
                <ScrollView
                  style={styles.videoDescriptionContainer}
                  onScroll={sustainInfoView}
                >
                  <Text
                    style={[styles.videoDescriptionText, styles.videoInfoColor]}
                  >
                    {props.videoData.description}
                  </Text>
                </ScrollView>
              </View>
            </View>
          </View>
        ) : null}
        {/* 중단 영역 */}
        <View style={styles.videoMiddleControllerContainer}>
          <View style={styles.videoMiddleDummyArea} />
          <VideoMiddleController
            isBuffering={isBuffering}
            isControlHidden={isControlHidden}
            togglePlay={togglePlay}
            isPlaying={isPlaying}
            didJustFinish={didJustFinish}
          />
          {!isControlHidden ? (
            <View style={styles.videoMiddleButtonContainer}>
              <Pressable onPress={likeThisVideo}>
                <MaterialIcons
                  selectable={false}
                  style={styles.videoMiddleButton}
                  color={noMoreLike ? iconStyles.heartColor : iconStyles.color}
                  name={"favorite"}
                />
                <Text selectable={false} style={styles.videoMiddleButtonText}>
                  좋아요
                </Text>
              </Pressable>
              <View style={styles.videoMiddleButtonSpace} />
              <Pressable
                onPress={() => {
                  /** TBD 평가하기 */
                  notImplemented();
                }}
              >
                <MaterialIcons
                  selectable={false}
                  style={styles.videoMiddleButton}
                  color={iconStyles.color}
                  name={"star"}
                />
                <Text selectable={false} style={styles.videoMiddleButtonText}>
                  평가하기
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
        {/* 하단 영역 */}
        <VideoBottomController
          togglePlay={togglePlay}
          isPlaying={isPlaying}
          didJustFinish={didJustFinish}
          videoPosition={videoPosition}
          videoLength={videoLength}
          seekVideo={seekVideo}
          useLikes
          onLike={likeThisVideo}
          onDislike={dislikeThisVideo}
          likesData={likeDataArray}
          noMoreLike={noMoreLike}
        />
      </View>
    </View>
  );
}

export default MainVideoPlayer;
