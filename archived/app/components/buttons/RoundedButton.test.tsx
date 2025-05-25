import {
  cleanup,
  fireEvent,
  render,
  RenderAPI,
} from "@testing-library/react-native";
import RoundedButton from "./RoundedButton";

const mockedHandleOnPress = jest.fn();

let component: RenderAPI;

beforeEach(() => {
  component = render(<RoundedButton onPress={mockedHandleOnPress} />);
});

afterEach(cleanup);

describe("RoundedButton", () => {
  it("잘 렌더링 된다.", () => {
    expect(component).toBeTruthy();
  });

  it("버튼을 누르면 전달한 함수가 실행된다.", () => {
    fireEvent(component.getByTestId("roundedButtonPressable"), "press");

    expect(mockedHandleOnPress).toHaveBeenCalled();
  });
});
