import { createFileRoute } from "@tanstack/react-router";
import SignupPage from "../../features/signup";

export const Route = createFileRoute("/_landingLayout/signup")({
  component: Signup,
});

function Signup() {
  return <SignupPage />;
}
