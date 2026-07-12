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
        userId={stage.uploader?.id}
        userHandle={stage.uploader?.handle}
        profilePictureUrl={stage.uploader?.profilePictureUrl}
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
      <div className={styles.time}>{formatTimer(length * 1000)}</div>
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
  userId: UserType["id"];
  userHandle?: UserType["handle"];
  profilePictureUrl: UserType["profilePictureUrl"];
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
  userHandle,
  profilePictureUrl,
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
        params={{ handle: userHandle! }}
      >
        <Profile
          profilePictureUrl={profilePictureUrl}
          userHandle={userHandle}
        />
      </Link>
      <div className={styles.infoCenter}>
        <span className={styles.title}>{title}</span>
        <span className={styles.subInfo}>
          <Link to="/studio/$handle" params={{ handle: userHandle! }}>
            {nickname ?? "알 수 없는 사용자"}
          </Link>
          <span>{formatDate(uploadedAt)}</span>
        </span>
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
          <p className={styles.subText}>{formatCount(likeCount ?? 0)}</p>
        </div>
        <div className={styles.countContainer}>
          <button>
            <IcoStar className={styles.icon} isActive={false} />
          </button>
          <p className={styles.subText}>{formatCount(starCount ?? 0)}</p>
        </div>
      </div>
    </div>
  );
};

export default StageCard;
