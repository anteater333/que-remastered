import { createFileRoute } from "@tanstack/react-router";
import OnBoardingPage from "../../features/onboarding";

export const Route = createFileRoute("/_landingLayout/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OnBoardingPage />;
}
