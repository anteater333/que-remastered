import { useNavigate } from "@tanstack/react-router";
import { VideoPlayer } from "../../../components/Players/VideoPlayer";
import { useStackedLayoutInitiator } from "../../navigation/stores/stackedLayoutStore";
import { VideoUploadPlaceholder } from "../components/VideoUploadPlaceholder";
import {
  useStageInfoQuery,
  useUpdateStageMutation as useUpdateStageMutation,
} from "../hooks/queries";
import { useUploadSceneStore } from "../stores/uploadSceneStore";
import styles from "./UploadEditorScene.module.scss";
import { usePreventLeave } from "../../../hooks/utils/usePreventLeave";
import {
  UploadEditorForm,
  type UploadEditorFormValues,
} from "../components/UploadEditorForm";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

const UploadEditorScene = () => {
  /** 현재 장면의 GNB 최초 상태 정의 */
  useStackedLayoutInitiator({
    title: "업로드",
    buttonType: "primary",
  });

  const navigate = useNavigate();
  const { progress, thumbnail, error, stageId, status } = useUploadSceneStore();
  const { data } = useStageInfoQuery(stageId ?? "");
  const { mutateAsync: updateStage } = useUpdateStageMutation(stageId ?? "");

  const handleSubmit = async (value: UploadEditorFormValues) => {
    try {
      await updateStage(value);
      toast.success("스테이지 정보가 업데이트되었습니다.");
      navigate({ to: "/" });
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        toast.error(
          isAxiosError(error)
            ? (error.response?.data?.message ??
                "스테이지 정보 업데이트 요청 중 오류가 발생했습니다.")
            : "스테이지 정보 업데이트 중 서버 오류가 발생했습니다.",
        );
      }
    }
  };

  /** 페이지 이탈 방어 */
  usePreventLeave({ enabled: true });

  if (!stageId) {
    navigate({ to: "/upload" });
  }

  return (
    <div className={styles.uploadModeSelectScene}>
      <div className={styles.videoContainer}>
        {status === "done" ? (
          <VideoPlayer />
        ) : (
          <VideoUploadPlaceholder
            thumbnailUrl={thumbnail}
            progress={progress}
            status={status}
            error={error}
          />
        )}
      </div>
      {!!data ? (
        <UploadEditorForm
          title={data.stage.title}
          description={data.stage.description}
          song=""
          onSubmit={handleSubmit}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default UploadEditorScene;
