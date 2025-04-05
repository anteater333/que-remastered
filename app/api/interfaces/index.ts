import LikeType, { LikeTypeSelector } from "../../types/Like";
import UserType from "../../types/User";
import VideoType from "../../types/Video";

/** 한 영상에 할 수 있는 최대 좋아요 수 */
export const MAX_VIDEO_LIKE_LIMIT = 3; // 근데 여기 두는게 맞나?

export enum QueResourceResponseErrorType {
  // Bad Requests
  BadBody = "400",
  AlreadyExist = "409",
  TooManyRequest = "429",
  Wrong = "403",
  NotFound = "404",
  Timeout = "408",
  SignInRequired = "401",
  Gone = "410",
  // Server Error
  UndefinedError = "500",
}

export interface QueResourceResponse<T = void> {
  /** 요청 성공 여부 */
  success: boolean;
  /** 요청한 데이터 */
  payload?: T;
  /** 에러 발생 시 에러 종류 */
  errorType?: QueResourceResponseErrorType;
}

/**
 * 리소스 서버 접근 관련 인터페이스 입니다.
 */
export interface QueResourceAPI {
  ////////////////////////////////////////////////// 비디오 정보 관련 인터페이스
  /**
   * 리소스 서버에 접근해 원본 비디오를 다운받을 수 있는 url을 반환합니다.
   */
  getVideoDownloadURL(storageURL: string): Promise<string>;
  /**
   * 리소스 서버에 접근해 원본 이미지를 다운받을 수 있는 url을 반환합니다.
   */
  getImageDownloadURL(storageURL: string): Promise<string>;
  /**
   * 리소스 서버에 접근해 VideoCardList에 적용할 수 있는 데이터 묶음을 반환합니다.
   * (firebase 사용 중인 현재 페이지 번호를 통한 pagination이 작동하지 않음)
   * // TBD 함수명 변경 (복수의 비디오 데이터를 가져온다는 의미를 좀 더 강조)
   * @param per 한 번에 가저올 데이터 개수
   * @param page 페이지 번호 (0이면 처음부터, 1이면 다음부터)
   */
  getVideoCardData(per: number, page: number): Promise<VideoType[]>;
  /**
   * 특정 사용자가 업로드한 영상 목록을 반환합니다.
   * @param userId 사용자 아이디
   * @param per 한 번에 가저올 데이터 개수
   * @param page 페이지 번호 (0이면 처음부터, 1이면 다음부터)
   */
  getVideoCardDataByUserId(
    userId: string,
    per: number,
    page: number
  ): Promise<VideoType[]>;
  /**
   * 리소스 서버에 접근해 지정한 비디오에 대한 메타 정보를 가져옵니다.
   * @param videoId 가저올 비디오의 고유 아이디
   */
  getVideoData(videoId: string): Promise<QueResourceResponse<VideoType>>;
  /**
   * 비디오와 비디오의 메타 정보를 업로드합니다.
   * @param videoSourcePath 원본 비디오 경로
   */
  uploadVideo(
    thumbnailSourcePath: string,
    videoSourcePath: string,
    videoData: VideoType
  ): Promise<QueResourceResponse>;
  /**
   * 비디오의 메타 정보를 수정합니다.
   * @param videoId 수정할 비디오 아이디
   * @param newVideoData 수정할 비디오 정보
   */
  updateVideoData(
    videoId: string,
    newVideoData: VideoType
  ): Promise<QueResourceResponse>;
  /**
   * 비디오를 삭제합니다.
   * @param videoId 삭제할 비디오 아이디
   */
  deleteVideo(videoId: string): Promise<QueResourceResponse>;

  ////////////////////////////////////////////////// 반응 관련 인터페이스
  /**
   * 로그인한 사용자가 해당 대상(영상, 공지, 재생목록 등등)에 반응한 좋아요를 가져옵니다.
   */
  getMyLikeReactions(
    likeType: LikeTypeSelector,
    targetId: string
  ): Promise<QueResourceResponse<LikeType[]>>;

  ////////////////////////////////////////////////// 영상에 대한 반응 관련 인터페이스
  /**
   * 영상의 시청 수를 증가시킵니다.
   * TBD 중복 시청 수 증가 방지, 당분간은 중복 허용
   * @param targetVideoId
   */
  increaseVideoViewCount(targetVideoId: string): Promise<QueResourceResponse>;
  /**
   * 로그인한 사용자가 영상에 좋아요를 추가합니다.
   * @param targetVideoId
   * @param likedAt
   * @returns 좋아요 수행 이후 해당 영상에 대한 좋아요 상태
   */
  likeVideo(
    targetVideoId: string,
    likedAt: number
  ): Promise<QueResourceResponse<LikeType[]>>;
  /**
   * 로그인한 사용자가 영상에 좋아요 추가를 취소합니다.
   * @param targetVideoId
   * @param likeId
   * @returns 좋아요 취소 수행 이후 해당 영상에 대한 좋아요 상태
   */
  dislikeVideo(
    targetVideoId: string,
    likeId: string
  ): Promise<QueResourceResponse<LikeType[]>>;

  ////////////////////////////////////////////////// 유저 정보 관련 인터페이스
  /**
   * userId를 통해 특정 사용자의 프로필 데이터를 가져옵니다.
   */
  getUserProfileData(userId: string): Promise<QueResourceResponse<UserType>>;
  /**
   * userId를 통해 사용자의 프로필 사진을 가져옵니다.
   */
  getUserProfilePicture(userId: string): Promise<QueResourceResponse<string>>;
  /**
   * 리소스 서버에 접근해 사용자 정보를 변경합니다.
   * 전달받은 속성만 변경되며, 정의되지 않은 속성은 변경되지 않습니다.
   */
  updateUserProfile(updateData: UserType): Promise<QueResourceResponse>;
  /**
   * 사용자의 프로필 사진 이미지를 업로드합니다.
   * @param filePath 업로드 할 이미지 경로
   */
  uploadUserProfileImage(filePath: string): Promise<QueResourceResponse>;
}

/**
 * 사용자 인증과 관련된 요청의 결과 추상화
 */
export enum QueAuthResponse {
  // Bad Requests
  BadBody = "400",
  AlreadyExist = "409",
  TooManyRequest = "429",
  Wrong = "403",
  NotFound = "404",
  Timeout = "408",
  SignInRequired = "401",
  Gone = "410",
  // Server Error
  ServerError = "500",
  // OK
  OK = "200",
  Created = "201",
  AlreadyPassed = "208",
}

// 로그인 관련 API 리턴 타입
/** 로그인 성공시 반환 */
export interface QueSignInSucceeded {
  status: QueAuthResponse.OK | QueAuthResponse.Created;
  user: UserType;
}
/** 로그인 실패시 반환 */
export interface QueSignInFailed {
  status:
    | QueAuthResponse.AlreadyExist
    | QueAuthResponse.Wrong
    | QueAuthResponse.NotFound
    | QueAuthResponse.Gone
    | QueAuthResponse.BadBody;
}

/**
 * 사용자 인증 관련 인터페이스 입니다.
 */
export interface QueAuthAPI {
  /** 메일 검증 코드가 담긴 메일을 전송하도록 요청합니다. */
  requestVerificationCodeMail(mailAddr: string): Promise<QueAuthResponse>;
  /** 사용자가 입력한 검증 코드를 검증 서버에 전달해 검증 결과를 반환합니다. */
  sendVerificationCode(
    mailAddr: string,
    code: string
  ): Promise<QueAuthResponse>;
  /** Que 자체 서비스 회원 가입을 진행합니다. */
  signUpWithQueSelfManaged(
    mailAddr: string,
    password: string
  ): Promise<QueAuthResponse>;
  /** Que 계정을 사용한 로그인을 진행합니다. */
  signInWithQueSelfManaged(
    mailAddr: string,
    password: string
  ): Promise<QueSignInFailed | QueSignInSucceeded>;
  /** Google 계정을 사용한 로그인을 진행합니다. */
  signInWithGoogle(
    accessToken: string
  ): Promise<QueSignInFailed | QueSignInSucceeded>;
  /** 로그아웃 합니다. */
  signOut(): Promise<void>;
  /** 사용자 토큰을 갱신합니다. */
  refreshUser(): Promise<void>;
}
