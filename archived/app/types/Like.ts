/**
 * 사용자의 좋아요 관련 정보
 */
export default interface LikeType {
  /** 좋아요 고유 id */
  likeId?: string;
  /** 좋아요 한 대상 종류 */
  likeType?: LikeTypeSelector;
  /** 좋아요 한 사용자 ID */
  userId?: string;
  /** 좋아요 한 대상 ID */
  targetId?: string;
  /** 좋아요 시점 */
  likedAt?: Date;
  /** 영상 내 좋아요 시간대 */
  likePosition?: number;
}

export type LikeTypeSelector = "video" | "playlist";
