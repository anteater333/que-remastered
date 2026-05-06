import { useMutation, useQuery } from "@tanstack/react-query";
import {
  requestGetStageInfo,
  requestPostStage,
  requestPostStageVideo,
} from "../../api";
import { useUploadSceneStore } from "../../stores/uploadSceneStore";

export const useCreateStageMutation = () => {
  return useMutation({
    mutationFn: () => {
      return requestPostStage();
    },
  });
};

interface VideoUploadMutationProps {
  stageId: string;
  videoFile: File;
}

/**
 * 파일 업로드 및 업로드 상태 관리 훅
 */
export const useVideoUploadMutation = () => {
  const { setProgress, setStatus, setError } = useUploadSceneStore();

  return useMutation({
    mutationFn: async ({ stageId, videoFile }: VideoUploadMutationProps) => {
      try {
        await requestPostStageVideo({
          stageId,
          videoFile,
          onProgress: (event) => {
            setProgress(event.percentage);
          },
        });
        setStatus("done");
      } catch (error) {
        setStatus("error");
        setError("업로드에 실패했습니다.");
      }
    },
  });
};

export const QUERY_KEY_STAGE_INFO_FOR_EDIT = (stageId: string) => [
  "stageInfo",
  "editor",
  stageId,
];

/**
 * 스테이지 정보 조회 쿼리
 */
export const useStageInfoQuery = (stageId: string) => {
  return useQuery({
    queryKey: QUERY_KEY_STAGE_INFO_FOR_EDIT(stageId),
    queryFn: () => requestGetStageInfo({ stageId }),
  });
};
