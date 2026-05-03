import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_stackedLayout/upload/$stageId")({
  component: Index,
});

function Index() {
  return <div>Hello "/_stackedLayout/upload/stageId"!</div>;
}
