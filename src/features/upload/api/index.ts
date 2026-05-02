import APIInstance from "../../../lib/axios";

export interface PostStageResponse {
  message: string;
  stageId: string;
}

export const requestPostStage = async () => {
  return (await APIInstance.post<PostStageResponse>("/stages")).data;
};
