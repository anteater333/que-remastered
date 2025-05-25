import "react-native-gesture-handler/jestSetup";

/** react-navigator mocking */
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
