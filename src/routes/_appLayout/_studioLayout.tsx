import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout/_studioLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
