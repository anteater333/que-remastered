// TBD 테스트 코드 작성

/**
 * 느슨한 UUID를 생성하는 함수입니다. Random alpha-numeric string + 시간
 * 사용자, 영상등 주요 엔티티 생성에 사용하지 않기를 권장합니다.
 */
export function genSimpleUUID() {
  const dateTail = new Date().getTime();
  const header = Array.from(Array(10), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");

  return header + dateTail;
}
