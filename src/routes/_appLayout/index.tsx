import { createFileRoute } from "@tanstack/react-router";
import Timeline from "@/features/timeline";

export const Route = createFileRoute("/_appLayout/")({
  component: Index,
});

function Index() {
  return <Timeline />;
}
