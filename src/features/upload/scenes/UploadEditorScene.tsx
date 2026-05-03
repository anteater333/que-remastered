import { TextInput } from "../../../components/Inputs/TextInput";
import { VideoPlayer } from "../../../components/Players/VideoPlayer";
import { useStackedLayoutInitiator } from "../../navigation/stores/stackedLayoutStore";
import styles from "./UploadEditorScene.module.scss";

const UploadEditorScene = () => {
  /** 현재 장면의 GNB 최초 상태 정의 */
  useStackedLayoutInitiator({
    title: "업로드",
    buttonType: "primary",
  });

  return (
    <div>
      <div className={styles.videoContainer}>
        <VideoPlayer />
      </div>
      <div className={styles.infoContainer}>
        <TextInput type="text" placeholder="제목" />
        <TextInput type="text" placeholder="설명" />
        <TextInput type="text" placeholder="노래" />
      </div>
    </div>
  );
};

export default UploadEditorScene;
