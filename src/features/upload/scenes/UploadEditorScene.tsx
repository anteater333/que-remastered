import { useNavigate } from "@tanstack/react-router";
import { TextInput } from "../../../components/Inputs/TextInput";
import { VideoPlayer } from "../../../components/Players/VideoPlayer";
import { useStackedLayoutInitiator } from "../../navigation/stores/stackedLayoutStore";
import { VideoUploadPlaceholder } from "../components/VideoUploadPlaceholder";
import { useStageInfoQuery } from "../hooks/queries";
import { useUploadSceneStore } from "../stores/uploadSceneStore";
import styles from "./UploadEditorScene.module.scss";
import { usePreventLeave } from "../../../hooks/utils/usePreventLeave";

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
    <div>
      <div className={styles.videoContainer}>
        {status === "done" ? (
          <VideoPlayer />
        ) : (
          <VideoUploadPlaceholder
            thumbnailUrl={thumbnail}
            progress={progress}
          />
        )}
      </div>
      <textarea
        style={{ width: "540px", height: "540px" }}
        value={JSON.stringify(data, null, 4)}
      />
      <form className={styles.infoContainer}>
        <TextInput type="text" placeholder="제목" />
        <TextInput type="text" placeholder="설명" />
        <TextInput type="text" placeholder="노래" />
      </form>
    </div>
  );
};

export default UploadEditorScene;
