import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../../features/login";
import { z } from "zod";

export const Route = createFileRoute("/_landingLayout/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: Login,
});

function Login() {
  return <LoginPage />;
}
