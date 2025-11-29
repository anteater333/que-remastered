import { createFileRoute } from "@tanstack/react-router";
import Intro from "../features/intro";

export const Route = createFileRoute("/intro")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Intro />;
}
