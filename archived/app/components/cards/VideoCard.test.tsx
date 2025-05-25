import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  RenderAPI,
} from "@testing-library/react-native";

import VideoCard from "./VideoCard";
import mockVideoCardData from "../../../potato/mockData/VideoCardData";
import { formatCount } from "../../utils/formatter";
import { ReactTestRendererJSON } from "react-test-renderer";

/** 네비게이션 모의 함수 */
const mockedNavigate = jest.fn();

/** Mocking React navigation */
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

let component: RenderAPI;
let componentJSON: ReactTestRendererJSON;

beforeEach(async () => {
  component = render(<VideoCard videoInfo={mockVideoCardData[0]} />);
  componentJSON = component.toJSON() as ReactTestRendererJSON;
  await waitFor(() => {});
});

afterEach(cleanup);

describe("VideoCard", () => {
  it("3개의 영역으로 나뉜다.", () => {
    expect(componentJSON.children!.length).toBe(3);
  });

  it("테스트 데이터 중 단순 텍스트와 같은 1차적 요소가 카드에 반영된다.", () => {
    const sample = mockVideoCardData[0];
    const wannabeVideoTitle = sample.title;
    const wannabeVideoUploader = sample.uploader.nickname;
    const wannabeVideoLikeCount = formatCount(sample.likeCount!);
    const wannabeVideoStarCount = formatCount(sample.starCount!);
    const wannabeVideoViewCount = formatCount(sample.viewCount!);

    expect(component.getByText(wannabeVideoTitle!)).toBeTruthy();
    expect(component.getByText(wannabeVideoUploader)).toBeTruthy();
    expect(component.getByText(wannabeVideoLikeCount)).toBeTruthy();
    expect(component.getByText(wannabeVideoStarCount)).toBeTruthy();
    expect(component.getByText(wannabeVideoViewCount)).toBeTruthy();
  });

  it("카드를 누를 시 Video 화면으로 Navigation이 진행된다.", async () => {
    fireEvent.press(component.getByTestId("videoCard"));

    const navigated = mockedNavigate.mock.calls[0][0];

    /** mockedNavigate 총 호출 수에 대해서 주의 */
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(navigated).toBe("Video");
  });

  describe("첫 번째 View 영역", () => {
    it("이미지, 시간, 추가 옵션 버튼으로 이루어진다.", () => {
      const view = component.getByTestId("cardThumbnailView");
      const image = component.getByTestId("cardThumbnailImage");
      const time = component.getByTestId("cardThumbnailTime");
      const button = component.getByTestId("cardThumbnailButton");

      expect(view.children.length).toBe(3);
      expect(image.props.source.uri).not.toBe("");
      expect(time).not.toBeNull();
      expect(button).not.toBeNull();
    });

    it("버튼을 누를 시 추가 메뉴 모달을 출력한다.", async () => {
      const menuModal = await component.findByTestId("menuModal");

      // 초기 상태엔 드러나지 않는다.
      expect(menuModal.props.visible).toBe(false);
      // onPress 발생
      fireEvent.press(component.getByTestId("cardThumbnailButton"));
      // 모달이 드러난다.
      expect(menuModal.props.visible).toBe(true);
    });
  });

  describe("두 번재 view 영역", () => {
    it("프로필 사진, 제목, 사용자 이름, 시청 수, 좋아요, 평가점수로 이루어진다.", () => {
      const profilePic = component.getByTestId("cardInfoProfilePic");
      const title = component.getByTestId("cardInfoTitleText");
      const singer = component.getByTestId("cardInfoSingerText");
      const views = component.getByTestId("cardInfoViewCount");
      const likes = component.getByTestId("cardInfoLikeCount");
      const stars = component.getByTestId("cardInfoStarCount");

      expect(profilePic).toBeTruthy();
      expect(title).toBeTruthy();
      expect(singer).toBeTruthy();
      expect(views).toBeTruthy();
      expect(likes).toBeTruthy();
      expect(stars).toBeTruthy();
    });

    it("프로필 사진을 누르면 Profile 화면으로 Navigation이 진행된다.", async () => {
      fireEvent.press(component.getByTestId("cardInfoProfilePic"));

      const navigated = mockedNavigate.mock.calls[1][0];

      expect(mockedNavigate).toHaveBeenCalledTimes(2);
      expect(navigated).toBe("UserPage");
    });

    it("좋아요 아이콘을 누르면 좋아한다.", async () => {
      fireEvent.press(component.getByTestId("cardInfoLikeButton"));
      let changed = await component.findByTestId("cardInfoLikedButton");
      expect(changed).toBeTruthy();

      // 한 번 더 누르면 좋아하지 않는다.
      fireEvent.press(component.getByTestId("cardInfoLikedButton"));
      changed = component.queryByTestId("cardInfoLikeButton")!;
      expect(changed).toBeTruthy();
    });

    it("평가 아이콘을 누르면 Navigation이 진행된다.", async () => {
      fireEvent.press(component.getByTestId("cardInfoStarButton"));

      expect(mockedNavigate).toHaveBeenCalledTimes(3);
      const navigated = mockedNavigate.mock.calls[2][0];
      expect(navigated).toBe("Criticism");
    });
  });
});
