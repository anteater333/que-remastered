import type { StageSort } from "@shared/filters";
import APIInstance from "../../../lib/axios";
import type StageType from "../../../types/Stage";

export interface GetStageListParams {
  cursor?: string;
  limit?: number;
  sort?: StageSort;
}

export interface GetStageListResponse {
  items: StageType[];
  nextCursor: string | null;
}

export const getTimelineStageList = async (
  params: GetStageListParams,
): Promise<GetStageListResponse> => {
  try {
    const { data } = await APIInstance.get<GetStageListResponse>("/stages", {
      params: {
        ...(params.cursor && { cursor: params.cursor }),
        ...(params.limit && { limit: params.limit }),
        ...(params.sort && { sort: params.sort }),
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};
