import { Link } from "@tanstack/react-router";
import type VideoType from "../../types/Video";
import styles from "./VideoCard.module.scss";

interface VideoCardProps {
  video: VideoType;
}

/**
 * 기본 비디오 정보 카드 컴포넌트
 */
const VideoCard = ({ video }: VideoCardProps) => {
  return (
    <div>
      <CardOverlayView />
      <Link to={`/stage/$stageId`} params={{ stageId: video.videoId ?? "" }}>
        <CardThumbnailView thumbnailUrl={video.thumbnailUrl} />
      </Link>
      <CardInfoView />
    </div>
  );
};

interface CardOverlayViewProps {}

const CardOverlayView = ({}: CardOverlayViewProps) => {
  return <></>;
};

interface CardThumbnailViewProps {
  thumbnailUrl: VideoType["thumbnailUrl"];
}

/**
 * 카드 컴포넌트의 썸네일 영역
 */
const CardThumbnailView = ({ thumbnailUrl }: CardThumbnailViewProps) => {
  return (
    <>
      <img className={styles.thumbnail} src={thumbnailUrl} />
    </>
  );
};

/**
 * 카드 컴포넌트의 정보 영역
 */
const CardInfoView = () => {
  return (
    <div className={styles.info}>
      <div>Profile</div>
      <div>Title</div>
      <div>Score</div>
    </div>
  );
};

export default VideoCard;
