import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LandingGNB } from "../features/navigation";
import { useLandingLayoutStore } from "../features/navigation/stores/landingLayoutStore";

export const Route = createFileRoute("/_landingLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  const showLogo = useLandingLayoutStore((s) => s.showLogo);
  return (
    <>
      <LandingGNB showLogo={showLogo} />
      <Outlet />
    </>
  );
}
