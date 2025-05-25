import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";

import App from "./App";

describe("<App />", () => {
  it("잘 렌더링 된다.", async () => {
    const appScreen = render(<App />);

    waitFor(async () => {
      const appRootView = await appScreen.findByTestId("appRootView");
      act(() => {
        fireEvent(appRootView, "layout");
      });

      expect(appScreen).toBeTruthy();
    });
  });
});
