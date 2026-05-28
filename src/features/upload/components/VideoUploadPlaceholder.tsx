import type { VideoUploadStatus } from "../../../types/Stage";
import styles from "./VideoUploadPlaceholder.module.scss";

interface VideoUploadPlaceholderProps {
  thumbnailUrl: string | null;
  progress: number;
  status: VideoUploadStatus;
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
  console.log(status);
  return (
    <div className={styles.placeholderContainer}>
      <div className={styles.thumbnailContainer}>
        <img src={thumbnailUrl ?? ""} />
        <div className={styles.overlay} />
        {status === "PROCESSING" && (
          <div className={styles.indicatorContainer}>
            <div className={styles.spinner} />
            <span>인코딩 중</span>
          </div>
        )}
        {status === "FAILED" && (
          <div className={styles.indicatorContainer}>
            <span>{error || "오류가 발생했습니다."}</span>
          </div>
        )}
      </div>
      <div className={styles.progressBarTrack}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
