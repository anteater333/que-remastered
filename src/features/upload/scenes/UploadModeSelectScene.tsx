import styles from "./UploadModeSelectScene.module.scss";
import { IcoUpload } from "../../../components/common/icon/IcoUpload";
import React, { useRef, useState } from "react";
import clsx from "clsx";

/** FE측 파일 업로드 시점의 썸네일 추출 함수 */
const extractThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.currentTime = 1; // 임시 썸네일을 위해 1초 시점 캡처 TODO: 서버에 저장되는 썸네일과 형태 맞추기

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
      URL.revokeObjectURL(url); // 메모리 해제
    });
  });
};

const UploadModeSelectScene = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const thumb = await extractThumbnail(file);
    setThumbnailUrl(thumb);

    // 동일 파일 선택 가능하도록 초기화
    e.target.value = "";
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
      <div className={styles.buttonContainer}>
        <button className={styles.uploadButton} onClick={handleButtonClick}>
          {thumbnailUrl ? (
            <div className={styles.uploadPreview}>
              <img src={thumbnailUrl} alt="미리보기" />
            </div>
          ) : (
            <div className={styles.uploadIcon}>
              <IcoUpload />
            </div>
          )}
          <div
            className={clsx(
              styles.uploadText,
              selectedFile && styles.uploadVideoName,
            )}
          >
            {selectedFile ? selectedFile.name : "파일 업로드"}
          </div>
        </button>
      </div>
    </div>
  );
};

export default UploadModeSelectScene;
