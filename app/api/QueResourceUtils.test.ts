import VideoType from "../types/Video";
import {
  getImageDownloadURL,
  getVideoDownloadURL,
  getVideoCardData,
} from "./QueResourceUtils";

jest.setTimeout(10000);

const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

describe("getVideoDownloadURL", () => {
  const mockVideoStorageURL = "gs://que-backend-dev.appspot.com/testvideo.mp4";
  const expectedResult =
    "https://firebasestorage.googleapis.com/v0/b/que-backend-dev.appspot.com/o/testvideo.mp4?alt=media&token=92554770-0ef5-4e1f-8ee8-21b70f29dc53";

  it("URL 문자열을 반환한다.", async () => {
    const result = await getVideoDownloadURL(mockVideoStorageURL);

    expect(typeof result).toBe("string");
    expect(result).toEqual(expect.stringMatching(urlRegex));
  });

  it("제대로된 다운로드 가능 URL을 반환한다.", async () => {
    const result = await getVideoDownloadURL(mockVideoStorageURL);

    expect(result).toBe(expectedResult);
  });
});

describe("getImageDownloadURL", () => {
  const mockImageStorageURL =
    "gs://que-backend-dev.appspot.com/videos/thumbnail/image 2.png";
  const expectedResult =
    "https://firebasestorage.googleapis.com/v0/b/que-backend-dev.appspot.com/o/videos%2Fthumbnail%2Fimage%202.png?alt=media&token=eb095c87-0a2c-46e0-a436-dc3fc958e8e3";

  it("URL 문자열을 반환한다.", async () => {
    const result = await getImageDownloadURL(mockImageStorageURL);

    expect(typeof result).toBe("string");
    expect(result).toEqual(expect.stringMatching(urlRegex));
  });

  it("제대로된 다운로드 가능 URL을 반환한다.", async () => {
    const result = await getImageDownloadURL(mockImageStorageURL);

    expect(result).toBe(expectedResult);
  });
});

describe("getVideoCardData", () => {
  const [per, page] = [5, 0];

  let result: VideoType[];
  beforeEach(async () => {
    result = await getVideoCardData(per, page);
  });
  it("객체 배열을 반환한다.", () => {
    expect(Array.isArray(result)).toBeTruthy();
    expect(typeof result[0]).toBe("object");
  });

  it(`배열의 길이는 매개변수 per 만큼 가진다.`, () => {
    expect(result.length).toEqual(per);
  });

  it("새로운 페이지를 넣어 호출할 경우 새로운 데이터 배열을 반환한다.", async () => {
    const newPage = 1;
    const newResultWithNewPage = await getVideoCardData(per, newPage);
    expect(result).not.toEqual(newResultWithNewPage);

    // // 추후 테스트 슈트 분리 필요
    // // 현재 테스트 DB에 들어있는 데이터 수가 6개라서 수행 가능
    // // 페이지 끝에 도달해 더 읽을 데이터가 없는 경우 빈 배열을 반환한다.
    // const noMoreData = await getVideoCardData(per, newPage);
    // expect(noMoreData.length).toEqual(0);
  });

  it("각 데이터는 카드를 표시하는데 필요한 속성을 가지고 있다.", () => {
    result.forEach((data) => {
      expect(data.title).not.toBeUndefined();
      expect(data.uploader?.nickname).not.toBeUndefined();
      expect(data.uploader?.profilePictureUrl).not.toBeUndefined();
      expect(data.uploadedAt).not.toBeUndefined();
      expect(data.viewCount).not.toBeUndefined();
      expect(data.likeCount).not.toBeUndefined();
      expect(data.starCount).not.toBeUndefined();
      expect(data.viewed).not.toBeUndefined();
      expect(data.myLikedData).not.toBeUndefined();
      expect(data.myStarredData).not.toBeUndefined();
    });
  });
});
