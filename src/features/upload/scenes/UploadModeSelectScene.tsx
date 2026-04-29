import styles from "./UploadModeSelectScene.module.scss";
import { IcoUpload } from "../../../components/common/icon/IcoUpload";

const UploadModeSelectScene = () => {
  return (
    <div className={styles.uploadModeSelectScene}>
      <button className={styles.uploadButton}>
        <div className={styles.uploadIcon}>
          <IcoUpload />
        </div>
        <div className={styles.uploadText}>파일 업로드</div>
      </button>
    </div>
  );
};

export default UploadModeSelectScene;
