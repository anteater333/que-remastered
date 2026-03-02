import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_appLayout/_studioLayout/studio/$handle/",
)({
  component: Index,
});

/**
 * 스튜디오 > 홈
 */
function Index() {
  const { handle } = Route.useParams();

  return (
    <div>
      <h3>Welcome {handle}'s Studio</h3>
    </div>
  );
}
