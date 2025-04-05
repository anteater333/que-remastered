import { useCallback, useState } from "react";
import { View } from "react-native";
import QueResourceClient from "../../../api/QueResourceUtils";
import notices from "../../../assets/notices/notices";
import VideoCardList from "../../../components/lists/VideoCardList";
import NoticeModal from "../../../components/modals/NoticeModal";
import { useAuth } from "../../../hooks/useAuth";
import { useLoadingIndicator } from "../../../hooks/useLoadingIndicator";
import { useNotice } from "../../../hooks/useNotice";
import screens from "../../../styles/screens";
import VideoType from "../../../types/Video";
import { useFocusEffect } from "@react-navigation/native";

/**
 * 영상 타임라인 스크린
 * API 콜은 여기서 합시다.
 */
function TimelineScreen() {
  /** 서버로부터 가저온 비디오 데이터 목록 */
  const [videoDataList, setVideoDataList] = useState<VideoType[]>([]);
  /** 가저올 비디오 데이터가 더 있는지 여부 */
  const [noMoreData, setNoMoreData] = useState<boolean>(false);

  /** 서비스 공지사항 존재 시 안내 메세지 표시 */
  const [hasNotice, setHasNotice] = useState<boolean>(false);

  /** 최초 영상 목록 로드 여부 */
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const { user } = useAuth();
  const { noticeList, addUser } = useNotice("ALPHA01"); // !! 공지 수정 시 아이디 변경

  const loading = useLoadingIndicator();

  /** 공지 표출 여부 판단 */
  useFocusEffect(
    useCallback(() => {
      if (user.userId && !noticeList[user.userId]) {
        setHasNotice(true);
        addUser(user.userId);
      }
    }, [user.userId, noticeList])
  );

  /** 영상 목록을 처음부터 불러옵니다. 화면 최초 렌더링 시, 리스트 새로고침 시 호출됩니다. */
  const getInitialData = useCallback(async () => {
    setNoMoreData(false);
    const initialDataLength = 5;
    const initialData = await QueResourceClient.getVideoCardData(
      initialDataLength,
      0
    );
    setVideoDataList(initialData);

    if (initialData.length < initialDataLength) {
      setNoMoreData(true);
    }
  }, []);

  /** 초기 데이터 설정 */
  useFocusEffect(
    useCallback(() => {
      if (!isInitialized) {
        loading.showLoading();
        getInitialData().finally(() => {
          setIsInitialized(true);
          loading.hideLoading();
        });
      }
    }, [isInitialized])
  );

  /** 스크롤 시 비디오 더 가져오기 */
  const getMoreVideoData = useCallback(async () => {
    const cardPerPage = 3;
    const newDataset = await QueResourceClient.getVideoCardData(cardPerPage, 1);
    setVideoDataList((prev) => {
      return [...prev, ...newDataset];
    });

    if (newDataset.length < cardPerPage) {
      setNoMoreData(true);
    }
  }, [videoDataList]);

  return (
    <View style={screens.defaultScreenLayout}>
      <NoticeModal
        visible={hasNotice}
        setModalVisible={setHasNotice}
        pages={notices}
      />
      <VideoCardList
        videoData={videoDataList}
        onScrollEnded={getMoreVideoData}
        noMoreData={noMoreData}
        onRefresh={getInitialData}
      />
    </View>
  );
}

export default TimelineScreen;
