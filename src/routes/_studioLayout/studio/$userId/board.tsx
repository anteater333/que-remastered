import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_studioLayout/studio/$userId/board")({
  component: Index,
});

/**
 * 스튜디오 > 홈
 */
function Index() {
  const { userId } = Route.useParams();

  return (
    <div>
      <h3>Welcome {userId}'s Studio - board</h3>
    </div>
  );
}
