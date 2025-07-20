import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { GNB } from "../components/navigation/GNB";
import { FNB } from "../components/navigation/FNB";

export const Route = createRootRoute({
  component: () => (
    <>
      <GNB />
      <Outlet />
      <FNB />
      <TanStackRouterDevtools />
    </>
  ),
});
