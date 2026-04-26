import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_uploadLayout/upload")({
  component: Upload,
});

function Upload() {
  return <div>Hello "/_uploadLayout/"!</div>;
}
