import type VideoType from "../../types/Video";

interface VideoCardProps {
  video: VideoType;
}

/**
 * 기본 비디오 정보 카드 컴포넌트
 */
const VideoCard = ({ video }: VideoCardProps) => {
  return (
    <>
      <CardThumbnailView thumbnailUrl={video.thumbnailUrl} />
      <CardInfoView />
    </>
  );
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
      <img src={thumbnailUrl} />
    </>
  );
};

/**
 * 카드 컴포넌트의 정보 영역
 */
const CardInfoView = () => {
  return <></>;
};

export default VideoCard;
