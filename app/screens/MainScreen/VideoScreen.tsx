import { Video } from "expo-av";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import QueResourceClient, {
  getVideoDownloadURL,
} from "../../api/QueResourceUtils";
import MainVideoPlayer from "../../components/videoPlayers/MainVideoPlayer";
import { useLoadingIndicator } from "../../hooks/useLoadingIndicator";
import { useViewList } from "../../hooks/useViewList";
import { MainStackScreenProp } from "../../navigators/MainNavigator";
import { bColors } from "../../styles/base";
import VideoType from "../../types/Video";

/**
 * 비디오 재생 화면
 */
const VideoScreen = ({ route, navigation }: MainStackScreenProp<"Video">) => {
  const [targetVideoData, setTargetVideoData] = useState<VideoType>({});
  const [videoUrl, setVideoUrl] = useState<string>("");

  /** 비디오에 대한 시청 수를 올리는 커스텀 훅 Callback */
  const increaseViewCount = useViewList();

  const loading = useLoadingIndicator();

  /** 비디오 화면 최초 렌더링 시 로딩 표시 우선 */
  useEffect(() => {
    loading.showLoading();
  }, []);

  /** 비디오 다운로드 가능한 주소 반환 */
  useEffect(() => {
    async function fetchVideo(videoUrl: string) {
      const httpDownloadUrl = await getVideoDownloadURL(videoUrl);
      setVideoUrl(httpDownloadUrl);
      loading.hideLoading();
    }

    if (targetVideoData.sourceUrl) fetchVideo(targetVideoData.sourceUrl);
  }, [targetVideoData.sourceUrl]);

  useEffect(() => {
    /** 비디오 정보를 서버로부터 가져옴 */
    async function fetchVideoInfo(videoId: string) {
      const result = await QueResourceClient.getVideoData(videoId);

      if (result.success) {
        setTargetVideoData(result.payload!);
      } else {
        // TBD 에러 처리
        console.error(result.errorType);
      }
    }

    if (route.params.videoId) {
      increaseViewCount(route.params.videoId);
      fetchVideoInfo(route.params.videoId);
    } else {
      // TBD VideoId 제공되지 않았음을 알리는 컴포넌트 표출
    }
  }, [route.params.videoId]);

  return (
    <View style={styles.container}>
      {!targetVideoData.videoId ? null : (
        <MainVideoPlayer videoData={targetVideoData} videoSource={videoUrl} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bColors.black,
  },
});

export default VideoScreen;
