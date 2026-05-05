import styles from "./UploadModeSelectScene.module.scss";
import { IcoUpload } from "../../../components/common/icon/IcoUpload";
import React, { useRef, useState } from "react";
import clsx from "clsx";
import {
  useStackedLayoutInitiator,
  useStackedLayoutStore,
} from "../../navigation/stores/stackedLayoutStore";
import {
  useCreateStageMutation,
  useVideoUploadMutation,
} from "../hooks/queries";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";
import { useUploadSceneStore } from "../stores/uploadSceneStore";

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
  // TODO: 저장하지 않은 스테이지가 있으면 목록 보여주기

  /** 현재 장면의 GNB 최초 상태 정의 */
  useStackedLayoutInitiator({
    title: "업로드",
    buttonType: "primary",
  });

  const { setGnb } = useStackedLayoutStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const { mutateAsync: createStage } = useCreateStageMutation();
  const { mutateAsync: uploadVideo } = useVideoUploadMutation();
  const navigate = useNavigate();
  const { startUpload } = useUploadSceneStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setSelectedFile(selectedFile);
    const thumb = await extractThumbnail(selectedFile);
    setThumbnailUrl(thumb);

    // 동일 파일 선택 가능하도록 초기화
    e.target.value = "";

    /** GNB의 확인 버튼 클릭 시 동작 정의 */
    const toNextScene = async () => {
      // 현재 선택된 파일을 기반으로 스테이지 생성 요청을 보낸 후 다음 씬으로 넘어갑니다.
      try {
        const { stageId } = await createStage();
        toast.success("스테이지가 생성되었습니다.");
        startUpload(stageId, selectedFile, thumb);
        uploadVideo({ stageId, videoFile: selectedFile });
        navigate({
          to: "/upload/$stageId",
          params: {
            stageId,
          },
        });
      } catch (error) {
        console.error(error);
        if (isAxiosError(error)) {
          toast.error(
            isAxiosError(error)
              ? (error.response?.data?.message ??
                  "스테이지 생성 요청 중 오류가 발생했습니다.")
              : "스테이지 생성 중 서버 오류가 발생했습니다.",
          );
        }
      }
    };
    setGnb({ buttonDisabled: false, onButtonClick: toNextScene });
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
