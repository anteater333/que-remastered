import { Link } from "@tanstack/react-router";
import type StageType from "../../types/Stage";
import styles from "./StageCard.module.scss";
import { formatCount, formatDate, formatTimer } from "../../utils/formatter";
import { Profile } from "../Profile/Profile";
import type UserType from "../../types/User";
import { IcoThumb } from "../common/icon/IcoThumb";
import { IcoStar } from "../common/icon/IcoStar";

interface StageCardProps {
  stage: StageType;
}

/**
 * 기본 비디오 정보 카드 컴포넌트
 */
const StageCard = ({ stage }: StageCardProps) => {
  return (
    <div>
      <div className={styles.cardHead}>
        <CardOverlayView length={stage.length} />
        <Link to={`/stage/$stageId`} params={{ stageId: stage.id ?? "" }}>
          <CardThumbnailView thumbnailUrl={stage.thumbnailUrl} />
        </Link>
      </div>
      <CardInfoView
        title={stage.title}
        userId={stage.uploader?.userId}
        nickname={stage.uploader?.nickname}
        videoId={stage.id}
        viewCount={stage.viewCount}
        likeCount={stage.likeCount}
        starCount={stage.starCount}
        uploadedAt={stage.uploadedAt}
      />
    </div>
  );
};
interface CardOverlayViewProps {
  length: StageType["length"];
}

const CardOverlayView = ({ length }: CardOverlayViewProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.time}>{formatTimer(length)}</div>
    </div>
  );
};

interface CardThumbnailViewProps {
  thumbnailUrl: StageType["thumbnailUrl"];
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
  title: StageType["title"];
  userId: UserType["userId"];
  nickname: UserType["nickname"];
  videoId: StageType["id"];
  viewCount: StageType["viewCount"];
  likeCount: StageType["likeCount"];
  starCount: StageType["starCount"];
  uploadedAt: StageType["uploadedAt"];
}

/**
 * 카드 컴포넌트의 정보 영역
 */
const CardInfoView = ({
  title,
  userId,
  nickname,
  videoId,
  viewCount,
  likeCount,
  starCount,
  uploadedAt,
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

      <Link
        className={styles.profile}
        to="/studio/$handle"
        params={{ handle: userId! }}
      >
        <Profile />
      </Link>
      <div className={styles.infoCenter}>
        <p className={styles.title}>{title}</p>
        <p className={styles.subInfo}>
          <Link to="/studio/$handle" params={{ handle: userId! }}>
            {nickname}
          </Link>
          <p>{formatDate(uploadedAt)}</p>
        </p>
      </div>
      <div
        onClick={(event) => {
          event.preventDefault();
        }}
        className={styles.infoRight}
      >
        <div className={styles.countContainer}>
          <p className={styles.mainCountArea}>{formatCount(viewCount)}</p>
          <p className={styles.subText}>views</p>
        </div>
        <div className={styles.countContainer}>
          <button>
            <IcoThumb className={styles.icon} isActive={false} />
          </button>
          <p className={styles.subText}>{formatCount(likeCount)}</p>
        </div>
        <div className={styles.countContainer}>
          <button>
            <IcoStar className={styles.icon} isActive={false} />
          </button>
          <p className={styles.subText}>{formatCount(starCount)}</p>
        </div>
      </div>
    </div>
  );
};

export default StageCard;
