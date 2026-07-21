import APIInstance from "../../../lib/axios";
import type StudioType from "../../../types/Studio";

export interface GetStudioParams {
  handle: string;
}

export interface GetStudioResponse {
  studio: StudioType;
}

export const getStudioInfo = async ({
  handle,
}: GetStudioParams): Promise<GetStudioResponse> => {
  const { data } = await APIInstance.get<GetStudioResponse>(
    `/studios/${handle}`,
  );

  return data;
};
