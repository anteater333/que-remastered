import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/studio")({
  component: Index,
});

function Index() {
  return (
    <div>
      <h3>Welcome Studio</h3>
    </div>
  );
}
