import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_landingLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
