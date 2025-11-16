import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { StudioSubGNB } from "../features/studio/components/StudioSubGNB";

export const Route = createFileRoute("/_studioLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = useParams({ strict: false });

  return (
    <div>
      <StudioSubGNB userId={userId!} />
      <Outlet />
    </div>
  );
}
