import { useMutation } from "@tanstack/react-query";
import { requestPostStage, requestPostStageVideo } from "../../api";
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
