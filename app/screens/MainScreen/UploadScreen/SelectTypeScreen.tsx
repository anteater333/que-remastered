import {
  Platform,
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import screens from "../../../styles/screens";
import { uploadScreenStyle } from "./UploadScreen.style";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { UploadStackNavigationProp } from "../../../navigators/UploadNavigator";
import { useCallback, useContext, useEffect } from "react";
import { UploadContext } from "./UploadContext";
import * as ImagePicker from "expo-image-picker";
import {
  checkFileSize,
  checkSizeLimitMB,
  checkVideoLengthManually,
} from "../../../utils/file";
import { useToast } from "native-base";
import { getThumbnails } from "video-metadata-thumbnails";
import * as VideoThumbnails from "expo-video-thumbnails";
import { blobToDataURL } from "../../../utils/converter";
import { useLoadingIndicator } from "../../../hooks/useLoadingIndicator";
import { useNotImplementedWarning } from "../../../hooks/useWarning";

const SIZE_LIMIT = 20; // MB

/**
 * 1. 영상 업로드 유형 선택
 * 새 영상 촬영 기능의 경우 용량 문제도 있고 구현 범위 축소에 따라 TBD
 */
function SelectTypeScreen() {
  const uploadNavigator = useNavigation<UploadStackNavigationProp>();

  const isFocused = useIsFocused();

  const Toast = useToast();

  /** Upload Context */
  const { setButtonHidden, setThumbnailPath, setVideoPath, setVideoLength } =
    useContext(UploadContext);

  const { hideLoading, showLoading } = useLoadingIndicator();

  /** 사용자가 이미 가지고 있는 영상을 업로드 하는 함수 */
  const uploadExistingVideo = useCallback(async () => {
    /** 갤러리 권한 요청 */
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    /** 권한 요청 거부됨 */
    if (permissionResult.granted === false) {
      if (Platform.OS === "android")
        // 어차피 Android 한정 코드라 다음 토스트 사용
        ToastAndroid.show("권한이 필요합니다.", ToastAndroid.SHORT);
      else {
        alert("권한이 필요합니다.");
      }

      return;
    }

    /** 영상 가져오기 */
    // https://github.com/expo/expo/issues/9374
    // TBD 알려진 expo image picker의 오류로 인해 큰 파일 업로드 시 문제 발생함.
    // 심지어 핸들링도 안됨.
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!pickerResult.cancelled) {
      showLoading(`영상을 가져오는 중입니다.`);
      const fileSize = await checkFileSize(pickerResult.uri);
      if (!fileSize) {
        // TBD 이런 경우 파악해서 에러 처리

        hideLoading();
        return;
      }
      if (!checkSizeLimitMB(fileSize, SIZE_LIMIT)) {
        // 사이즈 제한보다 영상 크기가 작은지 파악
        Toast.show({
          description: `영상이 너무 큽니다! (크기 제한 : ${SIZE_LIMIT}MB)`,
        });

        hideLoading();
        return;
      }

      /** 컨텍스트에 영상 경로 등록 */
      setVideoPath(pickerResult.uri);
      /** 컨텍스트에 영상 길이 등록 */
      if (pickerResult.duration) {
        setVideoLength(pickerResult.duration!);
      } else {
        // Web 환경에서는 duration이나 width 등의 정보가 제대로 로드되지 않음
        // 직접 Audio 객체 사용해 media 메타정보 불러올 수 있음.
        const duration = await checkVideoLengthManually(pickerResult.uri);
        setVideoLength(duration);
      }

      let thumbnailUri = "";
      /** 영상으로부터 썸네일 추출 */
      if (Platform.OS === "web") {
        const blobResult = (
          await getThumbnails(pickerResult.uri, {
            start: 0,
            end: 1,
          })
        )[0].blob!;

        thumbnailUri = await blobToDataURL(blobResult);
      } else {
        thumbnailUri = (
          await VideoThumbnails.getThumbnailAsync(pickerResult.uri)
        ).uri;
      }

      setThumbnailPath(thumbnailUri);

      hideLoading();

      /** 메타 정보 입력 화면으로 이동 */
      uploadNavigator.navigate("InputData");
    }
  }, []);

  const notImplemented = useNotImplementedWarning();
  /** 새 영상을 촬영하고 그 영상을 업로드 하는 함수 */
  const recordThenUploadVideo = useCallback(async () => {
    // TBD 영상 촬영 기능 및 uploadExistingVideo 함수와 겹치는 부분 분리하기
    notImplemented();
  }, []);

  /** 버튼 숨기기 */
  useEffect(() => {
    if (isFocused) {
      setButtonHidden(true);
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <Text style={uploadScreenStyle.warningText}>
        알파 버전 동안 영상의 크기가{`\n`}
        <Text style={{ fontWeight: "bold" }}>20MB</Text>로 제한됩니다.
      </Text>
      <View style={uploadScreenStyle.largeButtonsContainer}>
        <TouchableOpacity
          style={[uploadScreenStyle.largeButton]}
          onPress={uploadExistingVideo}
        >
          <MaterialIcons
            style={uploadScreenStyle.largeButtonIcon}
            name="file-upload"
          />
          <Text style={uploadScreenStyle.largeButtonText}>파일 업로드</Text>
        </TouchableOpacity>
        <View style={uploadScreenStyle.seperation} />
        <TouchableOpacity
          style={[uploadScreenStyle.largeButton]}
          onPress={recordThenUploadVideo}
        >
          <MaterialIcons
            style={[
              uploadScreenStyle.largeButtonIcon,
              uploadScreenStyle.largeButtonDisabled,
            ]}
            name="video-call"
          ></MaterialIcons>
          <Text
            style={[
              uploadScreenStyle.largeButtonText,
              uploadScreenStyle.largeButtonDisabled,
            ]}
          >
            새 영상 촬영
          </Text>
        </TouchableOpacity>
        {/* TBD 영상 사이즈 관련 안내 */}
      </View>
    </SafeAreaView>
  );
}

export default SelectTypeScreen;
