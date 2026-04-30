import styles from "./UploadModeSelectScene.module.scss";
import { IcoUpload } from "../../../components/common/icon/IcoUpload";
import React, { useRef, useState } from "react";

const UploadModeSelectScene = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.uploadModeSelectScene}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button className={styles.uploadButton} onClick={handleButtonClick}>
        <div className={styles.uploadIcon}>
          <IcoUpload />
        </div>
        <div className={styles.uploadText}>파일 업로드</div>
      </button>
      <div>Tmp: {selectedFile?.name}</div>
    </div>
  );
};

export default UploadModeSelectScene;
