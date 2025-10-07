import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setting")({
  component: Index,
});

function Index() {
  return (
    <div>
      <h3>Welcome Setting</h3>
    </div>
  );
}
