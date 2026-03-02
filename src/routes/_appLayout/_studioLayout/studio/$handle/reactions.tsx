import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_appLayout/_studioLayout/studio/$handle/reactions",
)({
  component: Index,
});

/**
 * 스튜디오 > 리액션
 */
function Index() {
  const { handle } = Route.useParams();

  return (
    <div>
      <h3>Welcome {handle}'s Studio - reactions</h3>
    </div>
  );
}
