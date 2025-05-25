import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import QueResourceClient, {
  getVideoDownloadURL,
} from "../../api/QueResourceUtils";
import { useLoadingIndicator } from "../../hooks/useLoadingIndicator";
import { MainStackScreenProp } from "../../navigators/MainNavigator";
import screens from "../../styles/screens";
import CommonHeader from "../../components/headers/CommonHeader";
import { VideoDataInputFieldSet } from "./UploadScreen/InputDataScreen";
import SongType from "../../types/Song";
import PlaceType from "../../types/Place";
import RoundedButton from "../../components/buttons/RoundedButton";
import { bFont, bSpace } from "../../styles/base";
import { useConfirm } from "../../hooks/useConfirm";
import { Toast } from "native-base";

/**
 * 비디오 재생 화면
 */
const VideoEditScreen = ({
  route,
  navigation,
}: MainStackScreenProp<"VideoEdit">) => {
  const [videoPath, setVideoPath] = useState<string>("");
  const [editVideoTitle, setEditVideoTitle] = useState<string>("");
  const [editVideoDescription, setEditVideoDescription] = useState<string>("");
  const [editSongInfo, setEditSongInfo] = useState<SongType>({});
  const [editPlaceInfo, setEditPlaceInfo] = useState<PlaceType>({});
  const [initVideoTitle, setInitVideoTitle] = useState<string>("");
  const [initVideoDescription, setInitVideoDescription] = useState<string>("");
  const [initSongInfo, setInitSongInfo] = useState<SongType>({});
  const [initPlaceInfo, setInitPlaceInfo] = useState<PlaceType>({});

  const [postable, setPostable] = useState<boolean>(false);

  const asyncAlert = useConfirm();

  const loading = useLoadingIndicator();

  /** 수정 화면 로드 시 데이터 처리 */
  useEffect(() => {
    async function fetchVideo() {
      loading.showLoading("영상을 불러오고 있습니다.");

      const prVideoData = route.params.videoData;
      let httpDownloadUrl = "";
      if (prVideoData.sourceUrl)
        httpDownloadUrl = await getVideoDownloadURL(prVideoData.sourceUrl!);
      setVideoPath(httpDownloadUrl);
      // 수정할 데이터들 초기화
      setEditVideoTitle(prVideoData.title!);
      setEditVideoDescription(prVideoData.description!);
      setEditSongInfo(prVideoData.song!);
      setEditPlaceInfo(prVideoData.place!);
      // 초기 데이터들 가져오기, 초기 데이터에서 변경점이 생겨야지 수정 등록 가능
      setInitVideoTitle(prVideoData.title!);
      setInitVideoDescription(prVideoData.description!);
      setInitSongInfo(prVideoData.song!);
      setInitPlaceInfo(prVideoData.place!);
      loading.hideLoading();
    }

    if (route.params.videoData.videoId) fetchVideo();
  }, [route.params.videoData]);

  useEffect(() => {
    // 바뀐게 없으면 수정하게 두지 말기
    if (
      editVideoTitle === initVideoTitle &&
      editVideoDescription === initVideoDescription &&
      editSongInfo.title === initSongInfo.title &&
      editSongInfo.singer === initSongInfo.singer &&
      editPlaceInfo.name === initPlaceInfo.name
    ) {
      setPostable(false);
    }
    // 장소, 설명은 optional 제목, 노래는 required
    else if (editVideoTitle.length < 2 || !editSongInfo.title) {
      setPostable(false);
    } else {
      setPostable(true);
    }
  }, [
    editVideoTitle,
    editVideoDescription,
    editSongInfo,
    editPlaceInfo,
    initPlaceInfo,
    initSongInfo,
    initVideoDescription,
    initVideoTitle,
  ]);

  /** 수정버튼 눌렀을 때의 처리 */
  const handleOnEditPressed = useCallback(async () => {
    const answer = await asyncAlert("수정하시겠습니까?");

    if (answer) {
      if (postable) {
        loading.showLoading("영상 정보를 수정하고 있습니다.");

        const result = await QueResourceClient.updateVideoData(
          route.params.videoData.videoId!,
          {
            title: editVideoTitle,
            description: editVideoDescription,
            song: editSongInfo,
            place: editPlaceInfo,
          }
        );

        if (result.success) {
          alert("수정이 완료되었습니다.");
        } else {
          alert("수정에 실패했습니다.");
        }
        loading.hideLoading();

        if (result.success) navigation.navigate("Home");
      } else {
        Toast.show({
          description: "수정에 실패했습니다. 입력을 확인해주세요.",
        });
      }
    }
  }, [
    editVideoTitle,
    editVideoDescription,
    editSongInfo,
    editPlaceInfo,
    postable,
    route.params.videoData.videoId,
  ]);

  /** 삭제버튼 눌렀을 때의 처리 */
  const handleOnDeletePressed = useCallback(async () => {
    const answer = await asyncAlert(
      "정말 삭제하시겠습니까?",
      "삭제는 되돌릴 수 없습니다!"
    );

    // 개발 중 auto reload 시 버그로 인해 추가합니다.
    if (videoPath) {
      if (answer) {
        // OK
        loading.showLoading("영상을 삭제하고 있습니다.");

        const result = await QueResourceClient.deleteVideo(
          route.params.videoData.videoId!
        );

        if (result.success) {
          alert("삭제가 완료되었습니다.");
        } else {
          alert("삭제에 실패했습니다.");
        }
        loading.hideLoading();

        navigation.navigate("Home");
      } else {
        // NO, do nothing
      }
    }
  }, [videoPath, route.params.videoData.videoId]);

  /** 헤더 설정 */
  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props) => (
        <CommonHeader
          {...props}
          buttonType={postable ? "enabledBorder" : "disabled"}
          onPress={handleOnEditPressed}
        />
      ),
      headerShown: true,
    });
  }, [postable, handleOnEditPressed, navigation]);

  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <VideoDataInputFieldSet
        videoPath={videoPath}
        videoTitle={editVideoTitle}
        setVideoTitle={setEditVideoTitle}
        videoDescription={editVideoDescription}
        setVideoDescription={setEditVideoDescription}
        songInfo={editSongInfo}
        setSongInfo={setEditSongInfo}
        placeInfo={editPlaceInfo}
        setPlaceInfo={setEditPlaceInfo}
      />
      <View style={styles.bottomDangerZone}>
        <RoundedButton
          style={styles.roundedButton}
          buttonType="danger"
          onPress={handleOnDeletePressed}
        >
          영상 삭제
        </RoundedButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomDangerZone: {
    paddingBottom: bSpace.middle,
    alignItems: "flex-end",
  },
  roundedButton: {
    width: bSpace.large * 6,
    height: bFont.large * 2,
    fontSize: bFont.large,
    marginRight: bSpace.middle,
  },
});

export default VideoEditScreen;
