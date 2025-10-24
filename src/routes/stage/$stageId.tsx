import { createFileRoute } from "@tanstack/react-router";
import Player from "../../features/player";

export const Route = createFileRoute("/stage/$stageId")({
  component: Index,
});

function Index() {
  const { stageId } = Route.useParams();

  return (
    <div>
      <h3>Welcome Stage</h3>
      <Player />
    </div>
  );
}
