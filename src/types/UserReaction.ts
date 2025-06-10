import type LikeType from "./Like";
import type { LikeTypeSelector } from "./Like";

export default interface UserReaction {
  /**
   * 사용자가 좋아요 한 대상 목록
   */
  likes?: {
    [likeType in LikeTypeSelector]?: {
      [targetId: string]: { [likeId: string]: LikeType };
    };
  };
  // TBD
  // stars?: {};
}
