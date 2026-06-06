import APIInstance, { API_SERVER_BASE_URL } from "../../../lib/axios";
import type StageType from "../../../types/Stage";

// #region 스테이지 생성
export interface PostStageResponse {
  message: string;
  stageId: string;
}

export const requestPostStage = async () => {
  return (await APIInstance.post<PostStageResponse>("/stages")).data;
};
// #endregion

// #region 스테이지 정보 수정
export interface PatchStageParams {
  stageId: string;
  title: StageType["title"];
  description: StageType["description"];
  // song: StageType["song"];
}

export const requestPatchStage = async (props: PatchStageParams) => {
  const { stageId, ...body } = props;

  return (
    await APIInstance.patch<PostStageResponse>(`/stages/${stageId}`, body)
  ).data;
};
// #endregion

// #region 스테이지에 비디오 업로드
export interface UploadProgressEvent {
  loaded: number;
  total: number;
  percentage: number;
}

export interface PostStageVideoParams {
  stageId: string;
  videoFile: File;
  onProgress?: (progress: UploadProgressEvent) => void;
}

export interface PostStageVideoResponse {
  message: string;
  stageId: string;
}

export const requestPostStageVideo = async ({
  stageId,
  videoFile,
  onProgress,
}: PostStageVideoParams) => {
  const formData = new FormData();
  formData.append("file", videoFile);

  return (
    await APIInstance.post<PostStageVideoResponse>(
      `/stages/${stageId}/video`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded / progressEvent.total) * 100,
              ),
            });
          }
        },
        timeout: 0,
      },
    )
  ).data;
};
// #endregion

// #region 단일 스테이지 조회
export interface GetStageInfoResponse {
  stage: StageType;
}

export const requestGetStageInfo = async ({ stageId }: { stageId: string }) => {
  return (await APIInstance.get<GetStageInfoResponse>(`/stages/${stageId}`))
    .data;
};

// #endregion

// #region 영상 업로드/처리 상태 조회용 EventSource
export const createVideoUploadStatusEventSource = (stageId: string) =>
  new EventSource(`${API_SERVER_BASE_URL}stages/${stageId}/video/status`);
// #endregion
