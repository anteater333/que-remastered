import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LandingGNB } from "../features/navigation";

export const Route = createFileRoute("/_landingLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <LandingGNB />
      <Outlet />
    </>
  );
}
