import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
  component: Index,
});

function Index() {
  return (
    <div>
      <h3>Welcome Search</h3>
    </div>
  );
}
