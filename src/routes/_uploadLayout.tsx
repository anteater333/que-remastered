import { createFileRoute, Outlet } from "@tanstack/react-router";
import { GNB } from "../features/navigation";

export const Route = createFileRoute("/_uploadLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <GNB />
      <Outlet />
    </>
  );
}
