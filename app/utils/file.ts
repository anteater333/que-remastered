import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { formatTimer } from "./formatter";

// TBD 테스트 코드 작성

/**
 * 파일의 크기를 계산해 byte 단위로 반환합니다.
 * @param fileURI
 * @returns 파일 크기 byte
 */
export async function checkFileSize(fileURI: string) {
  if (Platform.OS === "web") {
    // Web 환경에서는 expo-file-system이 동작하지 않아서 다른 방식 사용
    const blob = await (await fetch(fileURI)).blob();
    return blob.size;
  } else {
    const fileSizeBytes = await FileSystem.getInfoAsync(fileURI);
    return fileSizeBytes.size;
  }
}

/**
 * Byte 파일 크기를 MB 단위로 변환해 제한 MB보다 작은지 판단합니다.
 * @param fileSize
 * @param limitMB
 * @returns
 */
export function checkSizeLimitMB(fileSize: number, limitMB: number) {
  return fileSize / 1024 / 1024 <= limitMB;
}

/**
 * 영상의 전체 길이를 반환합니다.
 * 외부 라이브러리 등으로 영상 메타테이터를 읽어올 수 없을 때 사용합니다.
 * @param videoURI
 * @returns
 */
export async function checkVideoLengthManually(
  videoURI: string
): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const media = new Audio(videoURI);
    media.onloadedmetadata = function () {
      resolve(Math.ceil(media.duration * 1000));
    };
  });
}
