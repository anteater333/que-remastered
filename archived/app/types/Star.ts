/**
 * 사용자의 평가 관련 정보
 */
export default interface StarType {
  /** 평가 한 사용자 ID */
  userId?: string;
  /** 평가 한 영상 ID */
  videoId?: string;
  /** 평가 시점 */
  starreddAt?: Date;
  /** 평가 점수 */
  score?: { vocal?: number; visual?: number; vibe?: number };
}
