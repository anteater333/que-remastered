/**
 * 제공된 URL이 내부 경로인지 확인한다. 만약 아닐 경우 루트 경로(/)를 반환한다.
 */
export const getSafeInnerURL = (path: string | undefined) => {
  if (path && path.startsWith("/") && !path.startsWith("//")) {
    return path;
  } else {
    return "/";
  }
};
