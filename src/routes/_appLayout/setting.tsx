import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout/setting")({
  component: Setting,
});

function Setting() {
  return (
    <div>
      <h3>Welcome Setting</h3>
    </div>
  );
}
