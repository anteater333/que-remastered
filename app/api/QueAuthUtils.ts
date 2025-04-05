// QueAuthUtils.ts
/**
 * @module QueAuthUtils
 * 서버 리소스 접근 메소드 묶음 입니다. 자세한 정보는 인텔리센스의 도움을.
 */

import { QueResourceAPI, QueAuthAPI, QueAuthResponse } from "./interfaces";

import { FirebaseAuthClient } from "./firebase/firebaseClient";
import MailVerificationClient from "./mailVerification/mailVerificationClient";
import TestApiClient from "./testApi/testApiClient";

/**
 * Concrete API Instance 조립
 */
let QueAuthClient: QueAuthAPI;
if (process.env.NODE_ENV !== "test") {
  // 백엔드 구현체에 따라 메소드를 조립하면 됩니다.

  /** 메일 검증서버 API 클라이언트 */
  const verificationClient = MailVerificationClient;
  /** Firebase 직접 사용 인증 클라이언트 */
  const authClient = FirebaseAuthClient;

  QueAuthClient = {
    requestVerificationCodeMail: verificationClient.requestVerificationCodeMail,
    sendVerificationCode: verificationClient.sendVerificationCode,
    signUpWithQueSelfManaged: verificationClient.signUpWithQueSelfManaged,
    signInWithGoogle: authClient.signInWithGoogle,
    signInWithQueSelfManaged: authClient.signInWithQueSelfManaged,
    signOut: authClient.signOut,
    refreshUser: authClient.refreshUser,
  };
} else {
  // TBD 테스트용 메소드들
  QueAuthClient = {
    requestVerificationCodeMail: async () => QueAuthResponse.OK,
    sendVerificationCode: async () => QueAuthResponse.OK,
    signUpWithQueSelfManaged: async () => QueAuthResponse.Created,
    signInWithQueSelfManaged: async () => {
      return { status: QueAuthResponse.OK, user: {} };
    },
    signInWithGoogle: async () => {
      return { status: QueAuthResponse.OK, user: {} };
    },
    signOut: async () => {},
    refreshUser: async () => {},
  };
}

export default QueAuthClient;

export const {
  requestVerificationCodeMail,
  sendVerificationCode,
  signInWithGoogle,
  signInWithQueSelfManaged,
  signOut,
  signUpWithQueSelfManaged,
} = QueAuthClient;
