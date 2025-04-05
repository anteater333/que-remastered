import { cleanup, render, RenderAPI } from "@testing-library/react-native";
import CommonTextInput from "./CommonTextInput";

let component: RenderAPI;

beforeEach(() => {
  component = render(<CommonTextInput />);
});

afterEach(cleanup);

describe("RoundedButton", () => {
  it("잘 렌더링 된다.", () => {
    expect(component).toBeTruthy();
  });
});
