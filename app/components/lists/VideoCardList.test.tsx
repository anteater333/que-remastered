import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  RenderAPI,
  waitFor,
} from "@testing-library/react-native";
import VideoCardList from "./VideoCardList";

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
beforeEach(() => {
  component = render(<VideoCardList />);
});

afterEach(cleanup);

describe("VideoCardList", () => {
  let initialListLength = 0;

  it("리스트 컴포넌트가 잘 렌더링 된다.", () => {
    const cardList = component.getByTestId("videoCardList");

    expect(cardList).toBeTruthy();
  });

  it("리스트는 카드 아이템을 1개 이상 가지고 있다.", async () => {
    const cardList = component.getByTestId("videoCardList");

    // layout 이벤트 발생
    fireEvent(cardList, "layout", {
      nativeEvent: { layout: { width: 300 } },
    });

    const cardListItems = await component.findAllByTestId("videoCardItem", {
      exact: false,
    });

    initialListLength = cardListItems.length;
    expect(initialListLength).toBeGreaterThanOrEqual(1);
  });

  it("아래 끝 까지 스크롤 시 데이터가 추가된다.", async () => {
    const cardList = component.getByTestId("videoCardList");

    try {
      // layout 이벤트 발생
      fireEvent(cardList, "layout", {
        nativeEvent: { layout: { width: 300 } },
      });

      const newCardList = await component.findByTestId("videoCardList");

      fireEvent(newCardList, "endReached");

      const newCardListItem = await component.findByTestId(
        "videoCardItem" + initialListLength
      );

      expect(newCardListItem).toBeTruthy();
    } catch (error) {
      // 실패!
      console.error(error);
      expect(null).toBeTruthy();
    }
  });
});
