import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout/alert")({
  component: Alert,
});

function Alert() {
  return (
    <div>
      <h3>Welcome Alert</h3>
    </div>
  );
}
