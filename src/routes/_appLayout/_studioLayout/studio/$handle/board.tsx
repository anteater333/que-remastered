import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_appLayout/_studioLayout/studio/$handle/board",
)({
  component: Index,
});

/**
 * 스튜디오 > 게시판
 */
function Index() {
  const { handle } = Route.useParams();

  return (
    <div>
      <h3>Welcome {handle}'s Studio - board</h3>
    </div>
  );
}
