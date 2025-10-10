import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  Text,
  View,
} from "react-native";
import VideoCard from "../cards/VideoCard";

import { useAssets } from "expo-asset";
import styles from "./VideoCardList.style";
import { useCallback, useState } from "react";
import VideoType from "../../types/Video";
import { bColors } from "../../styles/base";

type VideoCardListProps = {
  videoData: VideoType[];
  noMoreData?: boolean;
  hideNoMoreDataIndicator?: boolean;
  onScrollEnded: () => Promise<void>;
  onRefresh: () => Promise<void>;
};

/**
 * 비디오 카드 컴포넌트를 담는 스크롤 가능한 리스트 컴포넌트
 * 타임라인에 사용
 * @param props
 * @returns
 */
export default function VideoCardList(props: VideoCardListProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * 카드 리스트 아이템 렌더링 함수
   * @param param0
   * @returns
   */
  const handleRenderItem = useCallback(
    ({ item, index }: { item: VideoType | Indicator; index: number }) => {
      if ((item as VideoType).videoId) {
        // 정상적인 비디오 카드 데이터 처리
        return (
          <VideoCard
            testID={"videoCardItem" + index}
            videoInfo={item as VideoType}
          />
        );
      } else {
        // 인디케이터 컴포넌트 처리
        if ((item as Indicator).indicatorType == "isLoading")
          // 로딩중 표시
          return isLoading ? <LoadingIndicator /> : null;
        else if ((item as Indicator).indicatorType == "noMoreData")
          // 더 이상 데이터가 없는 경우 데이터 없음 표시
          return props.noMoreData && !props.hideNoMoreDataIndicator ? (
            <NoMoreDataIndicator />
          ) : null;
      }
      return null;
    },
    [props.noMoreData, isLoading],
  );

  /**
   * 스크롤이 끝까지 내려갔을 때 처리 함수
   */
  const handleEndReached = useCallback(async () => {
    if (!isLoading && !props.noMoreData) {
      setIsLoading(true);

      await props.onScrollEnded();

      setIsLoading(false);
    }
  }, [isLoading, props.noMoreData, props.onScrollEnded]);

  /**
   * 리스트 새로고침 시 처리 함수
   */
  const handleRefresh = useCallback(async () => {
    if (!isLoading) {
      setIsLoading(true);

      await props.onRefresh();

      setIsLoading(false);
    }
  }, [isLoading, props.onRefresh]);

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      testID="videoCardList"
      data={[
        ...props.videoData,
        { indicatorType: "isLoading" },
        { indicatorType: "noMoreData" },
      ]}
      contentContainerStyle={styles.cardListConatiner}
      renderItem={handleRenderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.2}
      onRefresh={props.onRefresh}
      refreshing={isLoading}
      keyExtractor={(listItem) => {
        if ((listItem as VideoType).videoId)
          return (listItem as VideoType).videoId!;
        else return (listItem as Indicator).indicatorType;
      }}
    />
  );
}

/**
 * 카드 리스트에 적용할 수 있는 메타 정보를 나타내는 인디케이터 타입
 */
type Indicator = {
  indicatorType: "noMoreData" | "isLoading";
};

/**
 * 더 불러올 데이터가 없는 경우 출력할 작은 아이콘
 * @returns
 */
function NoMoreDataIndicator() {
  const [assets, error] = useAssets([
    require("../../assets/custom/haeder-logo.png"),
  ]);
  return (
    <View style={styles.indicatorContainer}>
      {assets ? (
        <Image
          style={styles.noMoreDataImage}
          resizeMode="contain"
          source={assets[0] as ImageSourcePropType}
        />
      ) : null}
      <Text
        style={styles.easterMessage}
      >{`QUE는 아직 자라나는 중이에요 ;)`}</Text>
    </View>
  );
}

/**
 * 로딩 중임을 나타내는 스피너
 * @returns
 */
function LoadingIndicator() {
  return (
    <View style={styles.indicatorContainer}>
      <ActivityIndicator color={bColors.primary} size="large" />
    </View>
  );
}
