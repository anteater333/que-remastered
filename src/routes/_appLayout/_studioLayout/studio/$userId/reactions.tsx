import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout/_studioLayout/studio/$userId/reactions")({
  component: Index,
});

/**
 * 스튜디오 > 홈
 */
function Index() {
  const { userId } = Route.useParams();

  return (
    <div>
      <h3>Welcome {userId}'s Studio - reactions</h3>
    </div>
  );
}
