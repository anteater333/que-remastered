import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout/search")({
  component: Search,
});

function Search() {
  return (
    <div>
      <h3>Welcome Search</h3>
    </div>
  );
}
