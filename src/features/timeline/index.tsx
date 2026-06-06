import { useIntersectionObserver } from "../../hooks/utils/useIntersectionObserver";
import StageCardList from "./components/StageCardList";
import { useStageListQuery } from "./hooks/queries";

const Timeline = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useStageListQuery();

  const sentinelRef = useIntersectionObserver(fetchNextPage, !!hasNextPage);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <>
      <StageCardList data={items} />
      <div ref={sentinelRef} />
      {isFetchingNextPage && <div>로딩 중...</div>}
    </>
  );
};

export default Timeline;
