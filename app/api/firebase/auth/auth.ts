import { getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  AuthError,
  AuthErrorCodes,
} from "firebase/auth";
import UserType from "../../../types/User";
import {
  QueAuthResponse,
  QueSignInFailed,
  QueSignInSucceeded,
} from "../../interfaces";
import firebaseConfig from "../config";
import { getUserProfile, setUserDocument } from "../firestore/firestore";

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

/** Access token을 통해 사용자 email 확인 */
async function fetchUserEmail(token: string): Promise<string> {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return (await response.json()).email;
}

/**
 * Google 로그인 팝업에서 반환받은 엑세스토큰을 사용해
 * firebase로 제공되는 백엔드 서비스로부터 로그인 토큰을 발급받습니다.
 */
export async function signInWithGoogle(
  accessToken: string
): Promise<QueSignInFailed | QueSignInSucceeded> {
  const auth = getAuth();
  const credential = GoogleAuthProvider.credential(undefined, accessToken);

  try {
    const userEmail = await fetchUserEmail(accessToken);

    const signInMethods = await fetchSignInMethodsForEmail(auth, userEmail);

    if (!signInMethods.length) {
      // 기존 가입 계정 없음
      // 회원가입 쪽으로 넘기기
      const signInResult = await signInWithCredential(auth, credential);
      const userResult = signInResult.user;

      // 임시로 새 유저 정보 생성
      const signedUser: UserType = {
        userId: userResult.uid,
        nickname: userResult.displayName!,
      };

      // spark 사용 중입니다.
      // 직접 firestore에 데이터 생성
      await setUserDocument(
        userResult.uid,
        userEmail,
        userResult.metadata.creationTime!,
        userResult.displayName
      );

      return {
        status: QueAuthResponse.Created,
        user: signedUser,
      };
    } else if (signInMethods.includes("google.com")) {
      // 구글 로그인 가능
      const signInResult = await signInWithCredential(auth, credential);

      // 유저 정보 생성
      const signedUser = (await getUserProfile(signInResult.user.uid)).payload!;

      return {
        status: QueAuthResponse.OK,
        user: signedUser,
      };
    } else {
      // 로그인 불가
      // TBD 사용자 설정에서 계정 연동하도록 유도 or firebase에서 이메일당 계정 연동 가능하도록 설정 후 로그인
      console.error("no google account");

      return { status: QueAuthResponse.AlreadyExist };
    }
  } catch (error) {
    if ((error as AuthError).code) {
      const errorCode = (error as AuthError).code;
      if (errorCode === AuthErrorCodes.INVALID_PASSWORD)
        // 비밀번호가 틀림
        return { status: QueAuthResponse.Wrong };
      else if (errorCode === AuthErrorCodes.USER_DELETED)
        // 사용자 없음
        return { status: QueAuthResponse.NotFound };
      else if (errorCode === AuthErrorCodes.USER_DISABLED) {
        // 사용자 계정 정지됨
        return { status: QueAuthResponse.Gone };
      } else if (errorCode === AuthErrorCodes.INVALID_EMAIL) {
        // 유효하지 않은 이메일
        return { status: QueAuthResponse.BadBody };
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
}

/**
 * 사용자 Email과 비밀번호로 로그인합니다.
 * @param email
 * @param password
 * @returns
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<QueSignInFailed | QueSignInSucceeded> {
  const auth = getAuth();
  try {
    const signInResult = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 로그인 여부 저장
    // 유저 정보 생성
    const signedUser = (await getUserProfile(signInResult.user.uid)).payload!;

    return { status: QueAuthResponse.OK, user: signedUser };
  } catch (error) {
    if ((error as AuthError).code) {
      const errorCode = (error as AuthError).code;
      if (errorCode === AuthErrorCodes.INVALID_PASSWORD)
        // 비밀번호가 틀림
        return { status: QueAuthResponse.Wrong };
      else if (errorCode === AuthErrorCodes.USER_DELETED)
        // 사용자 없음
        return { status: QueAuthResponse.NotFound };
      else if (errorCode === AuthErrorCodes.USER_DISABLED) {
        // 사용자 계정 정지됨
        return { status: QueAuthResponse.Gone };
      } else if (errorCode === AuthErrorCodes.INVALID_EMAIL) {
        // 유효하지 않은 이메일
        return { status: QueAuthResponse.BadBody };
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
}

/**
 * firebase 계정 로그아웃.
 * 조촐합니다.
 */
export async function signOutFirebase(): Promise<void> {
  await getAuth().signOut();
}

/**
 * 최초 실행 시 호출해 로그인을 유지하도록 한다.
 */
export async function refreshUser(): Promise<void> {
  // 버그 수정, 개발 중 hot reloading 발생 시 currentUser를 한 번 참조하지 않으면 문제 발생함.
  // 따라서 리프레쉬 아래와 같이 한 번 수행.
  getAuth().currentUser;
}

/** 현재 사용자 UID 가져오는 함수 */
export function getCurrentUID(): string | undefined {
  if (getAuth().currentUser) {
    return getAuth().currentUser?.uid;
  } else {
    return undefined;
  }
}
