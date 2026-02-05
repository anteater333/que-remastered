import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../../features/login";

export const Route = createFileRoute("/_landingLayout/login")({
  component: Login,
});

function Login() {
  return <LoginPage />;
}
