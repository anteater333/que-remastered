import type StudioType from "./Studio";

export type VideoUploadStatus =
  | "INITIATED"
  | "UPLOADING"
  | "QUEUED"
  | "PROCESSING"
  | "DONE"
  | "FAILED";

/**
 * 스테이지(영상 + 정보)에 대한 정보 객체 형식
 */
export default interface StageType {
  /** 스테이지 고유 ID */
  id: string;
  /** 스테이지 제목 */
  title: string;
  /** 스테이지 설명 */
  description: string;
  /** 원본 영상 주소 */
  sourceUrl: string;
  /** 영상 썸네일 주소 */
  thumbnailUrl: string;
  /** 영상 길이 */
  length: number;
  // /** 영상 노래 정보 */
  // song?: Partial<Song>;
  /** 업로드 한 사용자(스튜디오) */
  studio?: Pick<StudioType, "id"> & {
    user: Pick<StudioType["user"], "handle" | "nickname" | "profilePictureUrl">;
  };
  /** 총 시청 수 */
  viewCount: number;
  /** 총 좋아요 수 */
  likeCount: number;
  // /** 좋아요 한 사람 목록 */
  // likedList?: { [userId: string]: { [likeId: string]: LikeType } };
  // /** 이 영상에 대한 현재 로그인 한 사용자의 좋아요 정보 */
  // myLikedData?: LikeType[];
  /** 총 평가 수 */
  starCount: number;
  // /** 평가 한 사람 목록 */
  // starredList?: { [userId: string]: StarType };
  // /** 이 영상에 대한 현재 로그인 한 사용자의 평가 정보 */
  // myStarredData?: StarType;
  /** 업로드한 날짜 */
  uploadedAt: Date;
  /** 영상 업로드 상태 */
  status: VideoUploadStatus;
}
