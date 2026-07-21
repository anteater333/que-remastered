import type UserType from "./User";

/** 스튜디오(사용자 페이지) 정보 객체 형식 */
export default interface StudioType {
  id: string;
  preferredGenres: string[];
  preferredArtists: string[];
  recommendedTrackArtist: string | null;
  recommendedTrackTitle: string | null;
  recommendedTrackLink: string | null;
  avgVocalScore: number | null;
  avgVisualScore: number | null;
  avgVibeScore: number | null;
  totalScore: number;
  totalLikes: number;
  totalViews: number;
  user: Pick<
    UserType,
    | "handle"
    | "nickname"
    | "profilePictureUrl"
    | "description"
    | "registeredAt"
    | "role"
  >;
}