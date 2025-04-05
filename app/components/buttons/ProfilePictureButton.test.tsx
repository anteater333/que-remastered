import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderAPI,
  waitFor,
} from "@testing-library/react-native";

import ProfilePicture from "./ProfilePictureButton";

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
beforeEach(async () => {
  component = render(<ProfilePicture userId="test" size={24} />);
  await waitFor(() => {});
});

describe("ProfilePicture", () => {
  it("잘 렌더링 된다.", () => {
    expect(component).toBeTruthy();
  });

  it("프로필 사진을 누르면 Profile 화면으로 Navigation이 진행된다.", async () => {
    fireEvent.press(component.getByTestId("profileButton"));

    const navigated = mockedNavigate.mock.calls[0][0];

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(navigated).toBe("UserPage");
  });
});
