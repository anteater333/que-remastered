import { getApps, initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  StorageError,
  deleteObject,
} from "firebase/storage";
import { dataURLToBlob } from "../../../utils/converter";
import {
  QueResourceResponse,
  QueResourceResponseErrorType,
} from "../../interfaces";
import { getCurrentUID } from "../auth/auth";
import firebaseConfig from "../config";

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

/**
 * firebase storage에 접근해 파일을 다운받을 수 있는 url을 반환받습니다.
 * @param url firebase storage에 할당된 파일의 경로
 */
export async function getMediaFromStorage(url: string): Promise<string> {
  const storage = getStorage();
  const imgRef = ref(storage, url);
  return await getDownloadURL(imgRef);
}

/**
 * firebase storage에 사용자의 프로필 사진을 업로드 하고
 * 그 경로를 현재 사용자의 정보에 저장합니다.
 * 만약 이미 등록된 이미지가 기존 이미지를 덮어씁니다.
 * @param filePath
 */
export async function uploadCurrentUserProfileImage(
  filePath: string
): Promise<QueResourceResponse> {
  const currentUid = getCurrentUID();
  if (!currentUid) {
    // 로그인 해주세요
    return {
      success: false,
      errorType: QueResourceResponseErrorType.SignInRequired,
    };
  }

  /** storage 내의 프로필 사진 경로 */
  const storagePath = `users/${currentUid}/images/profilePic`;

  try {
    /** ImagePicker의 결과를 Blob으로 변환 */
    const blob: Blob = await dataURLToBlob(filePath);

    const storageRef = ref(getStorage(), storagePath);
    const result = await uploadBytes(storageRef, blob);

    // TBD Blob에 close가 없음
    // blob.close();

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
}

/**
 * 비디오 영상을 Firebase storage에 업로드합니다
 */
export async function uploadVideoSource(
  thumbnailSourcePath: string,
  videoSourcePath: string,
  videoId: string
): Promise<{ videoOk: boolean; thumbnailOk: boolean }> {
  const rtStatus: { videoOk: boolean; thumbnailOk: boolean } = {
    videoOk: false,
    thumbnailOk: false,
  };

  const currentUid = getCurrentUID();
  if (!currentUid) {
    // 로그인 해주세요
    return rtStatus;
  }

  /** storage instance */
  const storage = getStorage();

  /** 영상 업로드 */
  try {
    /** storage 내의 영상 경로 */
    const videoStoragePath = `users/${currentUid}/videos/${videoId}/video`;

    const videoBlob: Blob = await dataURLToBlob(videoSourcePath);

    const videoStorageRef = ref(storage, videoStoragePath);
    const result = await uploadBytes(videoStorageRef, videoBlob);
    rtStatus.videoOk = true;
  } catch (error) {
    console.error(error);
    return rtStatus;
  }

  /** 썸네일 업로드 */
  try {
    /** storage 내의 썸네일 경로 */
    const thumbnailStoragePath = `users/${currentUid}/videos/${videoId}/thumbnail`;

    const thumbnailBlob: Blob = await dataURLToBlob(thumbnailSourcePath);

    const thumbnailStorageRef = ref(storage, thumbnailStoragePath);
    const result = await uploadBytes(thumbnailStorageRef, thumbnailBlob);
    rtStatus.thumbnailOk = true;
  } catch (error) {
    console.error(error);
    return rtStatus;
  }

  return rtStatus;
}

/**
 * 비디오 영상을 Firebase storage에서 삭제합니다.
 */
export async function deleteVideoSource(
  videoId: string
): Promise<QueResourceResponse> {
  try {
    const currentUid = getCurrentUID();
    if (!currentUid) {
      return {
        success: false,
        errorType: QueResourceResponseErrorType.SignInRequired,
      };
    }

    /** storage instance */
    const storage = getStorage();

    /** storage 내의 영상 경로 */
    const videoStoragePath = `users/${currentUid}/videos/${videoId}/video`;

    const videoStorageRef = ref(storage, videoStoragePath);
    await deleteObject(videoStorageRef);

    return {
      success: true,
    };
  } catch (error) {
    throw error;
  }
}

/** 사용자 Id를 기반으로 프로필 사진을 가져옵니다. */
export async function getProfilePicByUserId(
  userId: string
): Promise<QueResourceResponse<string>> {
  const storageUrl = `gs://${firebaseConfig.storageBucket}/users/${userId}/images/profilePic`;

  try {
    const downloadUrl = await getMediaFromStorage(storageUrl);

    return { success: true, payload: downloadUrl };
  } catch (error) {
    if ((error as StorageError).code === "storage/object-not-found") {
      // Do Nothing
    } else console.error(error);
    return { success: false };
  }
}
