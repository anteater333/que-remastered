import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/alert")({
  component: Index,
});

function Index() {
  return (
    <div>
      <h3>Welcome Alert</h3>
    </div>
  );
}
