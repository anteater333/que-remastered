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

/**
 * 큰 수를 축약해 문자열로 표시하는 유틸 함수. ex) 12345 => 12.3k
 * @param count 표시 형식을 변환하려는 수
 * @returns 변환된 문자열
 */
export function formatCount(count: number) {
  if (count < 10000) {
    return count.toString();
  } else {
    const front = Math.floor(count / 1000);
    const back = Math.floor((count - front * 1000) / 100);

    return front.toString() + "." + back.toString() + "k";
  }
}

function addZeroPadding(str: string, length = 2) {
  const zeros = new Array(length - str.length).fill(0).join("");

  return zeros + str;
}

/**
 * Date 객체를 받아 yyyy-mm-dd 형식의 문자열로 변환합니다.
 * @param sourceDate
 */
export function formatDate(sourceDate: Date, separator = "-") {
  const year = sourceDate.getFullYear();
  let month = addZeroPadding((sourceDate.getMonth() + 1).toString());
  let day = addZeroPadding(sourceDate.getDate().toString());

  return [year, month, day].join(separator);
}
