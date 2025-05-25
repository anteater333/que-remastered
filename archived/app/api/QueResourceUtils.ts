// QueResourceUtils.ts
/**
 * @module QueResourceUtils
 * 서버 리소스 접근 메소드 묶음 입니다. 자세한 정보는 인텔리센스의 도움을.
 */

import { QueResourceAPI } from "./interfaces";

import { FirebaseResourceClient } from "./firebase/firebaseClient";
import TestApiClient from "./testApi/testApiClient";

/**
 * Concrete API Instance
 */
let QueResourceClient: QueResourceAPI;
if (process.env.NODE_ENV !== "test") {
  // 백엔드 구현체에 따라 메소드를 조립하면 됩니다.
  const resourceClient = FirebaseResourceClient;

  QueResourceClient = resourceClient;

  // 개발중이니까 일단은 테스트로
  // QueResourceClient = {
  //   ...resourceClient,
  //   getImageDownloadURL: TestApiClient.getImageDownloadURL,
  //   getVideoCardData: TestApiClient.getVideoCardData,
  // };
} else {
  // 테스트용 Mock API
  QueResourceClient = {
    getImageDownloadURL: TestApiClient.getImageDownloadURL,
    getVideoCardData: TestApiClient.getVideoCardData,
    getVideoDownloadURL: TestApiClient.getVideoDownloadURL,
    getVideoCardDataByUserId: () => {
      throw new Error("Not Implemented");
    },
    updateUserProfile: async (user) => {
      return { success: true };
    },
    getUserProfileData: async (userId) => {
      return { success: true };
    },
    uploadUserProfileImage: async (filePath) => {
      return { success: true };
    },
    uploadVideo: async () => {
      return { success: true };
    },
    getMyLikeReactions: () => {
      throw new Error("Not Implemented");
    },
    dislikeVideo: () => {
      throw new Error("Not Implemented");
    },
    increaseVideoViewCount: () => {
      throw new Error("Not Implemented");
    },
    likeVideo: () => {
      throw new Error("Not Implemented");
    },
    getVideoData: () => {
      throw new Error("Not Implemented");
    },
    getUserProfilePicture: () => {
      throw new Error("Not Implemented");
    },
    deleteVideo: () => {
      throw new Error("Not Implemented");
    },
    updateVideoData: () => {
      throw new Error("Not Implemented");
    },
  };
}

export default QueResourceClient;

export const {
  getImageDownloadURL,
  getUserProfileData,
  getVideoCardData,
  getVideoDownloadURL,
  updateUserProfile,
  deleteVideo,
  dislikeVideo,
  getMyLikeReactions,
  getUserProfilePicture,
  getVideoData,
  increaseVideoViewCount,
  likeVideo,
  updateVideoData,
  uploadUserProfileImage,
  uploadVideo,
} = QueResourceClient;
