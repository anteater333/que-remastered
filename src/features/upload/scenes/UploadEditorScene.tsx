import { TextInput } from "../../../components/Inputs/TextInput";
import { VideoPlayer } from "../../../components/Players/VideoPlayer";
import { useStackedLayoutInitiator } from "../../navigation/stores/stackedLayoutStore";
import { VideoUploadPlaceholder } from "../components/VideoUploadPlaceholder";
import { useStageInfoQuery } from "../hooks/queries";
import { useUploadSceneStore } from "../stores/uploadSceneStore";
import styles from "./UploadEditorScene.module.scss";

const UploadEditorScene = () => {
  /** 현재 장면의 GNB 최초 상태 정의 */
  useStackedLayoutInitiator({
    title: "업로드",
    buttonType: "primary",
  });

  const { progress, thumbnail, error, stageId, status } = useUploadSceneStore();

  const { data } = useStageInfoQuery(stageId ?? "");

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
      <textarea style={{ width: "540px", height: "540px" }}>
        {JSON.stringify(data, null, 4)}
      </textarea>
      <form className={styles.infoContainer}>
        <TextInput type="text" placeholder="제목" />
        <TextInput type="text" placeholder="설명" />
        <TextInput type="text" placeholder="노래" />
      </form>
    </div>
  );
};

export default UploadEditorScene;
