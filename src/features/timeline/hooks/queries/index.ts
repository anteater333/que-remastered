import type { StageSort } from "@shared/filters";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getTimelineStageList } from "../../api";

export const QUERY_KEY_TIMELINE = (sort?: StageSort) => ["timeline", sort];

export const useStageListQuery = (sort?: StageSort) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEY_TIMELINE(sort),
    queryFn: ({ pageParam }) =>
      getTimelineStageList({ cursor: pageParam, sort }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};
