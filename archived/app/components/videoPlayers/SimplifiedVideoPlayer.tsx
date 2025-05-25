import { AVPlaybackStatus, Video } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import VideoType from "../../types/Video";
import styles from "./VideoPlayer.style";
import { CONTROL_HIDE_TIMER } from "./VideoPlayer.global";
import {
  VideoBottomController,
  VideoMiddleController,
  VideoPlayerProps,
} from "./VideoPlayer.subset";
import { useToggleTimer } from "../../hooks/useTimer";

/** 간소화된 비디오 플레이어 컴포넌트 프로퍼티 타입 */
interface SimplifiedVideoPlayer {
  /** 이 프로퍼티에서는 비디오 메타 정보만 사용합니다. 비디오 원본 주소는 videoSource 프로퍼티로 전달해야 합니다. */
  videoData: VideoType;
  /** 비디오 원본 주소 입니다. */
  videoSource: string;
}

/**
 * 간소화된 비디오 플레이어 컴포넌트 입니다.
 * 화면의 전체를 덮지 않고 다른 UI 컴포넌트와 함께 사용될 필요가 있을 때 사용합니다.
 * TBD 전반적인 터치 액션 강화 (ex 10초 앞 뒤 건너뛰기)
 */
function SimplifiedVideoPlayer(props: VideoPlayerProps) {
  const videoPlayer = useRef<Video>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [didJustFinish, setDidJustFinish] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [videoPosition, setVideoPosition] = useState<number>(0);
  const [videoLength, setVideoLength] = useState<number>(1);
  const [isControlHidden, setIsControlHidden] = useState<boolean>(false);

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
      }
    },
    []
  );

  /** 영상이 끝나면 재생 버튼 표시하기 */
  useEffect(() => {
    if (didJustFinish) {
      setIsControlHidden(false);
    }
  }, [didJustFinish]);

  /** 영상 Seekbar 사용 함수 */
  const seekVideo = useCallback(
    (position) => {
      if (isLoaded) {
        videoPlayer.current?.setPositionAsync(videoLength * position);
      }
    },
    [videoLength, isLoaded]
  );

  /** 오버레이 숨김 처리 타이머 활성화 / 비활성화 */
  const refreshHidingControlTimer = useToggleTimer(
    setIsControlHidden,
    true,
    CONTROL_HIDE_TIMER
  );

  /** 오버레이 표시 상태에서 오버레이 영역 터치 시 오버레이 지우기 */
  const clearOverlay = useCallback(() => {
    if (!isControlHidden) {
      refreshHidingControlTimer();
      setIsControlHidden(true);
    }
  }, [isControlHidden]);

  /** 오버레이 비표시 상태에서 비디오 영역 터치 시 오버레이 표시하기 */
  const displayOverlay = useCallback(() => {
    if (isControlHidden) {
      refreshHidingControlTimer({ updateNewTimer: isPlaying });
      setIsControlHidden(false);
    }
  }, [isControlHidden, isPlaying]);

  /** 재생 / 정지 토글 함수 */
  const togglePlay = useCallback(() => {
    // TBD Web에서 좀 더 우아하게 컨트롤 표시 처리하기
    // 차라리 웹 전용 컴포넌트를 만드는게 더 유리할수도(장기계획)
    if (isLoaded) {
      if (isPlaying) {
        videoPlayer.current?.pauseAsync();
      } else {
        if (didJustFinish) {
          videoPlayer.current?.setPositionAsync(0);
        }
        videoPlayer.current?.playAsync();
      }
      refreshHidingControlTimer({ updateNewTimer: !isPlaying });
    }
  }, [isPlaying, didJustFinish, isLoaded, videoPlayer]);

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
      <View style={styles.videoControllerView}>
        {/* 상단 영역 */}
        <></>
        {/* 중단 영역 */}
        <View style={styles.videoMiddleControllerContainer}>
          <VideoMiddleController
            isBuffering={isBuffering}
            isControlHidden={isControlHidden}
            togglePlay={togglePlay}
            isPlaying={isPlaying}
            didJustFinish={didJustFinish}
          />
        </View>
        {/* 하단 영역 */}
        <VideoBottomController
          togglePlay={togglePlay}
          isPlaying={isPlaying}
          didJustFinish={didJustFinish}
          videoPosition={videoPosition}
          videoLength={videoLength}
          seekVideo={seekVideo}
        />
      </View>
    </View>
  );
}

export default SimplifiedVideoPlayer;
