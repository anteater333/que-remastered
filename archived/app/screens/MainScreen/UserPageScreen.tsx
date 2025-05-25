import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import QueResourceClient, {
  getUserProfileData,
} from "../../api/QueResourceUtils";
import MainScreenHeader from "../../components/headers/MainScreenHeader";
import VideoCardList from "../../components/lists/VideoCardList";
import { useLoadingIndicator } from "../../hooks/useLoadingIndicator";
import { MainStackScreenProp } from "../../navigators/MainNavigator";
import { bColors, bFont, bSpace } from "../../styles/base";
import screens from "../../styles/screens";
import UserType from "../../types/User";
import VideoType from "../../types/Video";

/**
 * 사용자 프로필 화면, 스튜디오
 * TBD 임시로 최소 기능만 구현된 상태임. 추후 원래 기획대로 구현하기.
 */
function UserPageScreen({
  route,
  navigation,
}: MainStackScreenProp<"UserPage">) {
  /** 사용자 정보 */
  const [userData, setUserData] = useState<UserType>({});
  /** 서버로부터 가저온 비디오 데이터 목록 */
  const [videoDataList, setVideoDataList] = useState<VideoType[]>([]);
  /** 가저올 비디오 데이터가 더 있는지 여부 */
  const [noMoreData, setNoMoreData] = useState<boolean>(false);

  /** 사용자 정보 가저오기 */
  useEffect(() => {
    async function getUserData() {
      const userResult = await getUserProfileData(route.params.userId);

      if (userResult.success) {
        setUserData(userResult.payload!);
      } else {
        // 에러처리
      }
    }

    getUserData();
  }, [route.params.userId]);

  /** 헤더 타이틀 설정 */
  useEffect(() => {
    navigation.setOptions({
      header: (props) => {
        return (
          <MainScreenHeader
            {...props}
            back={{
              title: userData.nickname + "의 스튜디오",
            }}
          />
        );
      },
    });
  }, [userData.nickname]);

  const loading = useLoadingIndicator();

  /** 영상 목록을 처음부터 불러옵니다. 화면 최초 렌더링 시, 리스트 새로고침 시 호출됩니다. */
  const getInitialData = useCallback(async () => {
    setNoMoreData(false);

    const initialDataLength = 5;
    const initialData = await QueResourceClient.getVideoCardDataByUserId(
      route.params.userId,
      initialDataLength,
      0
    );
    setVideoDataList(initialData);

    if (initialData.length < initialDataLength) {
      setNoMoreData(true);
    }
  }, []);

  /** 초기 데이터 설정 */
  useEffect(() => {
    if (route.params.userId) {
      loading.showLoading();
      getInitialData().finally(() => {
        loading.hideLoading();
      });
    }
  }, [route.params.userId]);

  /** 스크롤 시 비디오 더 가져오기 */
  const getMoreVideoData = useCallback(async () => {
    const cardPerPage = 3;
    const newDataset = await QueResourceClient.getVideoCardDataByUserId(
      route.params.userId,
      cardPerPage,
      1
    );
    setVideoDataList((prev) => {
      return [...prev, ...newDataset];
    });

    if (newDataset.length < cardPerPage) {
      setNoMoreData(true);
    }
  }, [videoDataList, route.params.userId]);

  return (
    <View style={screens.defaultScreenLayout}>
      <View style={userPageStyle.userPageUploadedVideoListContainer}>
        <Text style={userPageStyle.labelText}>무대</Text>
        {videoDataList.length === 0 ? (
          <Text style={userPageStyle.noVideoText}>
            아직 사용자가 업로드한 영상이 없습니다.
          </Text>
        ) : null}
        <VideoCardList
          videoData={videoDataList}
          onScrollEnded={getMoreVideoData}
          noMoreData={noMoreData}
          hideNoMoreDataIndicator
          onRefresh={getInitialData}
        />
      </View>
    </View>
  );
}

/** 임시 스타일 객체 */
const userPageStyle = StyleSheet.create({
  userPageUploadedVideoListContainer: {
    backgroundColor: bColors.white,
    paddingTop: bSpace.xlarge,
  },
  labelText: {
    fontSize: bFont.xlarge,
    marginLeft: bSpace.middle,
    paddingBottom: bSpace.middle,
  },
  noVideoText: {
    fontSize: bFont.middle,
    textAlign: "center",
    marginVertical: bSpace.xlarge,
  },
});

export default UserPageScreen;
