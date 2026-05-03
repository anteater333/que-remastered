import { createFileRoute } from "@tanstack/react-router";
import UploadModeSelectScene from "../../../features/upload/scenes/UploadModeSelectScene";

export const Route = createFileRoute("/_stackedLayout/upload/")({
  component: Index,
});

function Index() {
  return <UploadModeSelectScene />;
}
