import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stage/$stageId")({
  component: Index,
});

function Index() {
  const { stageId } = Route.useParams();

  return (
    <div>
      <h3>Welcome Stage</h3>
      <div>{stageId}</div>
    </div>
  );
}
