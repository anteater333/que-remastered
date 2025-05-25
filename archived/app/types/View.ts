/**
 * 사용자의 시청 관련 정보
 */
export default interface ViewType {
  /** 시청 한 사용자 ID */
  userId?: string;
  /** 시청 한 영상 ID */
  videoId?: string;
  /** 시청 시점 */
  viewedAt?: Date;
}
