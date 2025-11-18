import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout/_studioLayout/studio/$userId/stages")({
  component: Index,
});

/**
 * 스튜디오 > 홈
 */
function Index() {
  const { userId } = Route.useParams();

  return (
    <div>
      <h3>Welcome {userId}'s Studio - stages</h3>
    </div>
  );
}
