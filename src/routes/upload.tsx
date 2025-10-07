import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/upload")({
  component: Index,
});

function Index() {
  return (
    <div>
      <h3>Welcome Upload</h3>
    </div>
  );
}
