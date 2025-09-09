import { createRouter, RouterProvider } from "@tanstack/react-router";
import RootProvider from "./provider";
import { routeTree } from "../routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
/**
 * 어플리케이션 프로그램 최상단 컴포넌트
 */
function App() {
  return (
    <RootProvider>
      <div id="appContainer">
        <RouterProvider router={router} />
      </div>
    </RootProvider>
  );
}

export default App;
