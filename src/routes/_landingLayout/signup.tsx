import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landingLayout/signup")({
  component: Signup,
});

function Signup() {
  return <></>;
}
