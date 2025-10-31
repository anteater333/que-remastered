import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { GNB, FNB } from "@/features/navigation/index";

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
