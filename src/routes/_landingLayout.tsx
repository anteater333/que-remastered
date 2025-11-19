import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BackButton } from "../components/Buttons/BackButton";

export const Route = createFileRoute("/_landingLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <BackButton />
      <Outlet />
    </>
  );
}
