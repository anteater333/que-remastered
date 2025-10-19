/**
 * ms 단위 시간을 받아 분:초(m:ss) 형식으로 반환하는 유틸 함수.
 * @param msLength ms 단위 시간 정수
 * @returns
 */
export function formatTimer(msLength: number) {
  // TBD : 시간(hh)도 대응하기, 근데 서비스 특성 상 그럴 일이나 있겠어요?
  /** 초 단위로 변경 */
  const secLength = Math.floor(msLength / 1000);
  let min, sec;
  min = Math.floor(secLength / 60);
  sec = secLength % 60;
  if (sec < 10) {
    sec = "0" + sec;
  }
  return `${min}:${sec}`;
}
