import { getApps, initializeApp } from "firebase/app";
import firebaseConfig from "./config";
import {
  deleteVideoSource,
  getMediaFromStorage,
  getProfilePicByUserId,
  uploadCurrentUserProfileImage,
  uploadVideoSource,
} from "./storage/storage";
import {
  deleteVideoDocument,
  dislikeVideo,
  getMyLikeReactions,
  getUserProfile,
  getVideoCardDataByUserIdFromFirestore,
  getVideoCardDataFromFirestore,
  getVideoDocument,
  increaseVideoViewCount,
  likeVideo,
  setVideoDocument,
  updateCurrentUserProfile,
  updateVideoDocument,
  updateVideoUploaded,
} from "./firestore/firestore";
import {
  refreshUser,
  signInWithEmail,
  signInWithGoogle,
  signOutFirebase,
} from "./auth/auth";
import {
  QueResourceAPI,
  QueResourceResponse,
  QueResourceResponseErrorType,
} from "../interfaces";
import VideoType from "../../types/Video";

// initializing firebase client
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// TBD 너무 비대해지는 것 같으니까 좀 분리하기.
export const FirebaseResourceClient: QueResourceAPI = {
  getVideoDownloadURL: getMediaFromStorage,
  getImageDownloadURL: getMediaFromStorage,
  getVideoCardData: getVideoCardDataFromFirestore,
  getVideoCardDataByUserId: getVideoCardDataByUserIdFromFirestore,
  getVideoData: getVideoDocument,
  getUserProfileData: getUserProfile,
  getUserProfilePicture: getProfilePicByUserId,
  updateUserProfile: updateCurrentUserProfile,
  uploadUserProfileImage: uploadCurrentUserProfileImage,

  getMyLikeReactions: getMyLikeReactions,
  dislikeVideo: dislikeVideo,
  increaseVideoViewCount: increaseVideoViewCount,
  likeVideo: likeVideo,
  updateVideoData: updateVideoDocument,
  uploadVideo: async function (
    thumbnailSourcePath: string,
    videoSourcePath: string,
    videoData: VideoType
  ): Promise<QueResourceResponse> {
    /** 여러 단계로, 여러 Firebase 서비스에 걸쳐 나뉘어진 행동이라 메소드를 조립하는 방식으로 사용 */
    /** 영상 Document 먼저 등록 */
    const videoId = await setVideoDocument(videoData);
    /** 원본 영상 Storage에 업로드 */
    const uploadStatus = await uploadVideoSource(
      thumbnailSourcePath,
      videoSourcePath,
      videoId
    );
    if (uploadStatus.thumbnailOk && uploadStatus.videoOk) {
      /** 업로드 완료 표시 */
      await updateVideoUploaded(videoId, true);
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        errorType: QueResourceResponseErrorType.UndefinedError,
      };
    }
  },
  deleteVideo: async function (videoId: string) {
    /** 2단계로 나뉩니다. */
    try {
      /** 1. 도큐먼트 삭제 */
      const docResult = await deleteVideoDocument(videoId);
      if (!docResult.success) return docResult;

      /** 2. 원본 영상 삭제 */
      const storageResult = await deleteVideoSource(videoId);
      if (!storageResult.success) return storageResult;

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        errorType: QueResourceResponseErrorType.UndefinedError,
      };
    }
  },
};

export const FirebaseAuthClient = {
  signInWithGoogle: signInWithGoogle,
  signInWithQueSelfManaged: signInWithEmail,
  signOut: signOutFirebase,
  refreshUser: refreshUser,
};
