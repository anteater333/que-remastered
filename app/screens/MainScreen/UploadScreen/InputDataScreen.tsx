import React, { useContext, useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";
import screens from "../../../styles/screens";
import { uploadScreenStyle as styles } from "./UploadScreen.style";
import { UploadContext } from "./UploadContext";
import { ScrollView } from "native-base";
import CommonTextInput from "../../../components/inputs/CommonTextInput";
import SimplifiedVideoPlayer from "../../../components/videoPlayers/SimplifiedVideoPlayer";
import { useIsFocused } from "@react-navigation/native";
import VideoType from "../../../types/Video";
import SongType from "../../../types/Song";
import PlaceType from "../../../types/Place";

type InputDataScreenPropType =
  | {
      editMode?: false;
    }
  | {
      editMode: true;
      videoData: VideoType;
    };

/**
 * 2. 업로드한 영상에 대한 편집(일단 TBD) 및 메타 정보 입력 화면
 */
function InputVideoDataScreen(props: InputDataScreenPropType) {
  const isFocused = useIsFocused();

  const {
    setButtonHidden,
    setButtonEnabled,
    placeInfo,
    setPlaceInfo,
    songInfo,
    setSongInfo,
    videoDescription,
    setVideoDescription,
    videoTitle,
    setVideoTitle,
    videoPath,
  } = useContext(UploadContext);

  /** 첫 렌더링 시 버튼 숨김 해제 */
  useEffect(() => {
    if (isFocused) {
      setButtonHidden(false);
      setButtonEnabled(false);
    }
  }, [isFocused]);

  /** 필요 데이터가 입력된 경우를 확인해 버튼 활성화하기 */
  useEffect(() => {
    // 장소, 설명은 optional 제목, 노래는 required
    if (videoTitle.length >= 2 && !!songInfo.title) {
      setButtonEnabled(true);
    }
  }, [videoTitle, songInfo.title]);

  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <VideoDataInputFieldSet
        placeInfo={placeInfo}
        setPlaceInfo={setPlaceInfo}
        setSongInfo={setSongInfo}
        videoPath={videoPath}
        videoTitle={videoTitle}
        setVideoTitle={setVideoTitle}
        videoDescription={videoDescription}
        setVideoDescription={setVideoDescription}
        songInfo={songInfo}
      />
    </SafeAreaView>
  );
}

export default InputVideoDataScreen;

/** 비디오 정보 입력 컴포넌트 분리 TBD 추후 컴포넌트 쪽 폴더로 옮기기 */
export function VideoDataInputFieldSet({
  setVideoTitle,
  videoPath,
  videoTitle,
  placeInfo,
  setPlaceInfo,
  setSongInfo,
  setVideoDescription,
  songInfo,
  videoDescription,
}: {
  videoPath: string;
  videoTitle: string;
  setVideoTitle: (value: React.SetStateAction<string>) => void;
  videoDescription: string;
  setVideoDescription: (value: React.SetStateAction<string>) => void;
  songInfo: SongType;
  setSongInfo: (value: React.SetStateAction<SongType>) => void;
  placeInfo: PlaceType;
  setPlaceInfo: (value: React.SetStateAction<PlaceType>) => void;
}) {
  return (
    <>
      <View style={styles.videoContainer}>
        <SimplifiedVideoPlayer
          // 임시 데이터입니다.
          videoData={{}}
          videoSource={videoPath}
        />
      </View>
      <ScrollView style={styles.dataInputContainer}>
        <Text style={styles.dataInputLabel}>무대 제목</Text>
        <CommonTextInput
          accessibilityRole="text"
          textContentType="none"
          style={styles.dataInputField}
          placeholder="무대 제목"
          onChangeText={(newStr) => setVideoTitle(newStr)}
          value={videoTitle}
        />
        <Text style={styles.dataInputLabel}>무대 설명</Text>
        <CommonTextInput
          accessibilityRole="text"
          textContentType="none"
          multiline
          style={styles.dataInputField}
          placeholder="무대 설명"
          onChangeText={(newStr) => setVideoDescription(newStr)}
          value={videoDescription}
        />
        <Text style={styles.dataInputLabel}>노래</Text>
        <CommonTextInput
          accessibilityRole="text"
          textContentType="none"
          style={styles.dataInputField}
          placeholder="노래"
          onChangeText={(newStr) => setSongInfo({ title: newStr })}
          value={songInfo.title}
        />
        <Text style={styles.dataInputLabel}>장소</Text>
        <CommonTextInput
          accessibilityRole="text"
          textContentType="none"
          style={styles.dataInputField}
          placeholder="장소"
          onChangeText={(newStr) => setPlaceInfo({ name: newStr })}
          value={placeInfo.name}
        />
      </ScrollView>
    </>
  );
}
