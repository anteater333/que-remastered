import { createFileRoute } from "@tanstack/react-router";
import Timeline from "@/features/timeline";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <Timeline />;
}
