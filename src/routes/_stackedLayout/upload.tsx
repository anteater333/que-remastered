import { createFileRoute } from "@tanstack/react-router";
import UploadModeSelectScene from "../../features/upload/scenes/UploadModeSelectScene";

export const Route = createFileRoute("/_stackedLayout/upload")({
  component: Upload,
});

function Upload() {
  return <UploadModeSelectScene />;
}
