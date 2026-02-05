import { createFileRoute } from "@tanstack/react-router";
import IntroPage from "../features/intro";

export const Route = createFileRoute("/intro")({
  component: Intro,
});

function Intro() {
  return <IntroPage />;
}
