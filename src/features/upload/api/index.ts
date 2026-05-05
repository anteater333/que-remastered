import APIInstance from "../../../lib/axios";

// #region 스테이지 생성
export interface PostStageResponse {
  message: string;
  stageId: string;
}

export const requestPostStage = async () => {
  return (await APIInstance.post<PostStageResponse>("/stages")).data;
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
