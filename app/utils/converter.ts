// TBD 테스트 코드 작성

/**
 * Blob Object를 DataURL로 변환하는 함수입니다.
 * @param blob Blob 오브젝트
 * @returns 변환된 URL, Promise입니다.
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (_e) => resolve(reader.result as string);
    reader.onerror = (_e) => reject(reader.error);
    reader.onabort = (_e) => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
}

/**
 * DataURL을 Blob Object로 변환하는 함수입니다.
 * @param dataURL DataURL
 * @returns 반환된 Blob, Promise입니다.
 */
export function dataURLToBlob(dataURL: string): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response as Blob);
    };
    xhr.onerror = function (e) {
      console.error(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", dataURL, true);
    xhr.send(null);
  });
}
