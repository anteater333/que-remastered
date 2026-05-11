import { useNavigate } from "@tanstack/react-router";
import { VideoPlayer } from "../../../components/Players/VideoPlayer";
import { useStackedLayoutInitiator } from "../../navigation/stores/stackedLayoutStore";
import { VideoUploadPlaceholder } from "../components/VideoUploadPlaceholder";
import { useStageInfoQuery } from "../hooks/queries";
import { useUploadSceneStore } from "../stores/uploadSceneStore";
import styles from "./UploadEditorScene.module.scss";
import { usePreventLeave } from "../../../hooks/utils/usePreventLeave";
import { UploadEditorForm } from "../components/UploadEditorForm";

const UploadEditorScene = () => {
  /** 현재 장면의 GNB 최초 상태 정의 */
  useStackedLayoutInitiator({
    title: "업로드",
    buttonType: "primary",
  });

  const navigate = useNavigate();
  const { progress, thumbnail, error, stageId, status } = useUploadSceneStore();
  const { data } = useStageInfoQuery(stageId ?? "");

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
          onSubmit={async (value) => {
            console.log("🥕 :: ", value);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default UploadEditorScene;
