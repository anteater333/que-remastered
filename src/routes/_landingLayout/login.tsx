import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landingLayout/login")({
  component: Login,
});

function Login() {
  return <></>;
}
