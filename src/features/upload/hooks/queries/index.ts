import { useMutation, useQuery } from "@tanstack/react-query";
import {
  requestGetStageInfo,
  requestPatchStage,
  requestPostStage,
  requestPostStageVideo,
} from "../../api";
import { useUploadSceneStore } from "../../stores/uploadSceneStore";
import type StageType from "../../../../types/Stage";

export const useCreateStageMutation = () => {
  return useMutation({
    mutationFn: () => {
      return requestPostStage();
    },
  });
};

interface UpdateStageMutationProps {
  title: StageType["title"];
  description: StageType["description"];
  // song: StageType["song"];
}

export const useUpdateStageMutation = (stageId: string) => {
  return useMutation({
    mutationFn: (props: UpdateStageMutationProps) => {
      return requestPatchStage({ stageId, ...props });
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
        setStatus("encoding");
      } catch (error) {
        setStatus("error");
        setProgress(0);
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
    enabled: stageId !== "",
  });
};
