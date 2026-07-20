import type UserType from "./User";

/** 스테이지 조회 API가 함께 내려주는 축소된 스튜디오 정보 */
export default interface StudioType {
  id: string;
  user: Pick<UserType, "handle" | "nickname" | "profilePictureUrl">;
}