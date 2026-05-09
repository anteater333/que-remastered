import type { UploadStatus } from "../stores/uploadSceneStore";
import styles from "./VideoUploadPlaceholder.module.scss";

interface VideoUploadPlaceholderProps {
  thumbnailUrl: string | null;
  progress: number;
  status: UploadStatus;
  error: string | null;
}

/**
 * 업로드 -> 스테이지 설명 작성 화면에서 영상 업로드 중 상태를 나타내는 플레이스홀더 컴포넌트
 */
export const VideoUploadPlaceholder = ({
  thumbnailUrl,
  progress,
  status,
  error,
}: VideoUploadPlaceholderProps) => {
  return (
    <div className={styles.placeholderContainer}>
      <div className={styles.thumbnailContainer}>
        <img src={thumbnailUrl ?? ""} />
        <div className={styles.overlay} />
      </div>
      <div className={styles.progressBarTrack}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
