import { Link } from "@tanstack/react-router";
import type VideoType from "../../types/Video";
import styles from "./VideoCard.module.scss";
import { formatTimer } from "../../utils/formatter";
import { Profile } from "../Profile/Profile";
import type UserType from "../../types/User";
import { IcoThumb } from "../common/icon/IcoThumb";
import { IcoStar } from "../common/icon/IcoStar";

interface VideoCardProps {
  video: VideoType;
}

/**
 * 기본 비디오 정보 카드 컴포넌트
 */
const VideoCard = ({ video }: VideoCardProps) => {
  return (
    <div>
      <div className={styles.cardHead}>
        <CardOverlayView length={video.length} />
        <Link to={`/stage/$stageId`} params={{ stageId: video.videoId ?? "" }}>
          <CardThumbnailView thumbnailUrl={video.thumbnailUrl} />
        </Link>
      </div>
      <CardInfoView
        title={video.title}
        nickname={video.uploader?.nickname}
        videoId={video.videoId}
        viewCount={video.viewCount}
        likeCount={video.likeCount}
        starCount={video.starCount}
      />
    </div>
  );
};
interface CardOverlayViewProps {
  length: VideoType["length"];
}

const CardOverlayView = ({ length }: CardOverlayViewProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.time}>{formatTimer(length)}</div>
    </div>
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
    <div>
      <img className={styles.thumbnail} src={thumbnailUrl} />
    </div>
  );
};

interface CardInfoViewProps {
  title: VideoType["title"];
  nickname: UserType["nickname"];
  videoId: VideoType["videoId"];
  viewCount: VideoType["viewCount"];
  likeCount: VideoType["likeCount"];
  starCount: VideoType["starCount"];
}

/**
 * 카드 컴포넌트의 정보 영역
 */
const CardInfoView = ({
  title,
  nickname,
  videoId,
  viewCount,
  likeCount,
  starCount,
}: CardInfoViewProps) => {
  return (
    <div className={styles.info}>
      <Link
        to={"/stage/$stageId"}
        params={{ stageId: videoId ?? "" }}
        className={styles.infoMainLink}
      >
        <p>{title} 영상 보기</p>
      </Link>

      <Link className={styles.profile} to="/studio">
        <Profile />
      </Link>
      <div className={styles.infoCenter}>
        <p className={styles.title}>{title}</p>
        <p className={styles.nickname}>
          <Link to="/studio">{nickname}</Link>
        </p>
      </div>
      <div
        onClick={(event) => {
          event.preventDefault();
        }}
        className={styles.infoRight}
      >
        <div className={styles.countContainer}>
          <p className={styles.mainCountText}>{viewCount}</p>
          <p className={styles.subText}>views</p>
        </div>
        <div className={styles.countContainer}>
          <button>
            <IcoThumb className={styles.icon} isActive={false} />
          </button>
          <p className={styles.subCountText}>{likeCount}</p>
        </div>
        <div className={styles.countContainer}>
          <button>
            <IcoStar className={styles.icon} isActive={false} />
          </button>
          <p className={styles.subCountText}>{starCount}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
