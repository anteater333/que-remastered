import {
  cleanup,
  fireEvent,
  render,
  RenderAPI,
} from "@testing-library/react-native";
import SocialLoginButton from "./SocialLoginButton";

const mockedHandleOnPress = jest.fn();

let component: RenderAPI;

beforeEach(() => {
  component = render(
    <SocialLoginButton size={24} onPress={mockedHandleOnPress} />
  );
});

afterEach(cleanup);

describe("SocialLoginButton", () => {
  it("잘 렌더링 된다.", () => {
    expect(component).toBeTruthy();
  });

  it("버튼을 누르면 전달한 함수가 실행된다.", () => {
    fireEvent(component.getByTestId("socialLoginButtonPressable"), "press");

    expect(mockedHandleOnPress).toHaveBeenCalled();
  });
});
