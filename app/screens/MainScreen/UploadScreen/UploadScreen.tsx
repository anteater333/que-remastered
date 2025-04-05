import { useIsFocused, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import QueResourceClient from "../../../api/QueResourceUtils";
import CommonHeader from "../../../components/headers/CommonHeader";
import { useConfirm } from "../../../hooks/useConfirm";
import { useLoadingIndicator } from "../../../hooks/useLoadingIndicator";
import { MainStackNavigationProp } from "../../../navigators/MainNavigator";
import {
  UploadStackNavigationProp,
  UploadStackParamList,
} from "../../../navigators/UploadNavigator";
import screens from "../../../styles/screens";
import PlaceType from "../../../types/Place";
import SongType from "../../../types/Song";
import VideoType from "../../../types/Video";
import InputVideoDataScreen from "./InputDataScreen";
import SelectTypeScreen from "./SelectTypeScreen";
import { UploadContext } from "./UploadContext";

const UploadStack = createNativeStackNavigator<UploadStackParamList>();

/**
 * 영상 업로드 화면
 */
function UploadScreen() {
  // Context states
  /** 확인 버튼 숨기기 */
  const [buttonHidden, setButtonHidden] = useState<boolean>(true);
  /** 확인 버튼 활성화하기 */
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
  const [videoPath, setVideoPath] = useState<string>("");
  const [thumbnailPath, setThumbnailPath] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [videoLength, setVideoLength] = useState<number>(0);
  const [songInfo, setSongInfo] = useState<SongType>({ title: "" });
  const [placeInfo, setPlaceInfo] = useState<PlaceType>({ name: "" });

  const isFocused = useIsFocused();

  const asyncAlert = useConfirm();

  const mainNavigator = useNavigation<MainStackNavigationProp>();
  const uploadNavigator = useNavigation<UploadStackNavigationProp>();

  const { hideLoading, showLoading } = useLoadingIndicator();

  /**
   * 업로드 확인 버튼 눌렀을 때 실행되는 콜백함수
   * !! 업로드 화면 핵심 기능 입니다. !!
   */
  const uploadAndPostVideo = useCallback(async () => {
    // TBD 업로드 API 함수 호출 및 업로드 진행률 표시 방법론 구상
    // TBD 업로드 하시겠습니까? 질문하기.
    if (await asyncAlert("업로드 하시겠습니까?")) {
      showLoading(
        `영상을 업로드 중입니다.\n제발 종료하지 말아주세요...\n로딩은 개선 예정입니다.`
      );

      const newVideoData: VideoType = {
        title: videoTitle,
        description: videoDescription,
        song: songInfo,
        place: placeInfo,
        length: videoLength,
        likeCount: 0,
        starCount: 0,
        viewCount: 0,
      };

      /** 영상 업로드! (특: 중요함) */
      // TBD 로딩이 끔찍하게 깁니다.
      // 현 상황(blaze 요금제)에서 진행상황을 효율적으로 표출할 수 있는 방법 알아보기
      const uploadResult = await QueResourceClient.uploadVideo(
        thumbnailPath,
        videoPath,
        newVideoData
      );

      if (uploadResult.success) {
        alert("영상이 성공적으로 업로드됐습니다.");
        hideLoading();
        mainNavigator.reset({ routes: [{ name: "Home" }] });
      } else {
        // TBD 좀 더 정교한 에러 처리
        alert(
          `영상을 업로드 하는 중 문제가 발생했습니다.\n${uploadResult.errorType}`
        );
        hideLoading();
      }
    }
  }, [
    videoPath,
    thumbnailPath,
    videoTitle,
    videoLength,
    videoDescription,
    songInfo,
    placeInfo,
  ]);

  /**
   * 업로드 화면 재진입시 네비게이션 순서가 초기화 될 수 있도록 설정
   */
  useEffect(() => {
    if (!isFocused) {
      uploadNavigator.navigate("SelectType");
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <UploadContext.Provider
        value={{
          buttonEnabled,
          setButtonEnabled,
          buttonHidden,
          setButtonHidden,
          placeInfo,
          setPlaceInfo,
          songInfo,
          setSongInfo,
          videoDescription,
          setVideoDescription,
          videoTitle,
          setVideoTitle,
          videoLength,
          setVideoLength,
          videoPath,
          setVideoPath,
          thumbnailPath,
          setThumbnailPath,
        }}
      >
        <UploadStack.Navigator
          initialRouteName="SelectType"
          screenOptions={{
            contentStyle: screens.defaultScreenLayout,
            title: "업로드",
            header: (props) => (
              <CommonHeader
                hideButton={buttonHidden}
                buttonType={buttonEnabled ? "primary" : "disabled"}
                onPress={uploadAndPostVideo}
                {...props}
              />
            ),
          }}
        >
          <UploadStack.Screen
            options={{ headerShown: true }}
            name="SelectType"
            component={SelectTypeScreen}
          />
          <UploadStack.Screen
            options={{ headerShown: true }}
            name="InputData"
            component={InputVideoDataScreen}
          />
          {/* TBD 음악 검색 시스템 개발하기 (장기계획) */}
          {/* <UploadStack.Screen
          options={{ headerShown: true }}
          name="SearchSong"
          component={DummyComponent}
        /> */}
        </UploadStack.Navigator>
      </UploadContext.Provider>
    </SafeAreaView>
  );
}

export default UploadScreen;
