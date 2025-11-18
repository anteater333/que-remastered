import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FNB, GNB } from "../features/navigation";

export const Route = createFileRoute("/_appLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <GNB />
      <Outlet />
      <FNB />
      <TanStackRouterDevtools />
    </>
  );
}
