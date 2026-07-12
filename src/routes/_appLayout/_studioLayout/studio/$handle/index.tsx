import { createFileRoute } from "@tanstack/react-router";
import StudioHomeScene from "../../../../../features/studio/scenes/StudioHomeScene";

export const Route = createFileRoute(
  "/_appLayout/_studioLayout/studio/$handle/",
)({
  component: Index,
});

/**
 * 스튜디오 > 홈
 */
function Index() {
  return <StudioHomeScene />;
}
