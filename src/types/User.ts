import type { QueUserRole } from "../../shared/role";
import type UserLevel from "./UserLevel";
import type UserPage from "./UserPage";
import type UserPersonality from "./UserPersonality";
import type UserReaction from "./UserReaction";
import type UserStatus from "./UserStatus";

/**
 * 사용자 정보 객체 형식
 */
export default interface UserType {
  /** 사용자 고유 UUID */
  userId?: string;
  /** 사용자 고유 핸들 (readable ID) */
  handle: string;
  /** 사용자 권한 정보 */
  role: QueUserRole;
  /** 사용자 Email */
  email: string;
  /** 사용자 표시명 */
  nickname?: string;
  /** 프로필 사진 URL */
  profilePictureUrl?: string;
  /** 사용자 소개글 */
  description?: string;
  /** 사용자 팔로워 리스트 */
  follower?: { [userId: string]: UserType };
  /** 사용자 팔로잉 리스트 */
  following?: { [userId: string]: UserType };
  /** 사용자 개인화 정보 */
  personality?: UserPersonality;
  /** 사용자 페이지(Studio) 정보*/
  page?: UserPage;
  /** 사용자 등급 정보 */
  level?: UserLevel;
  /** 사용자 활동 통계 정보 */
  status?: UserStatus;
  /** 사용자 서비스 가입일 */
  registeredAt?: Date;
  /** 사용자가 한 반응 모음 */
  reactions?: UserReaction;
}

/** 사용자 프로필 표시용 타입 */
export interface UserProfileType {
  email: UserType["email"];
  handle: UserType["handle"];
  role: UserType["role"];
  nickname?: UserType["nickname"];
  profilePictureUrl?: UserType["profilePictureUrl"];
}
