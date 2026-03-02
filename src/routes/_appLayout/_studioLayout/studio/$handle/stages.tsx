import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_appLayout/_studioLayout/studio/$handle/stages",
)({
  component: Index,
});

/**
 * 스튜디오 > 영상
 */
function Index() {
  const { handle } = Route.useParams();

  return (
    <div>
      <h3>Welcome {handle}'s Studio - stages</h3>
    </div>
  );
}
