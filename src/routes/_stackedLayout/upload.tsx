import { createFileRoute } from "@tanstack/react-router";
import { useStackedLayoutInitiator } from "../../features/navigation/stores/stackedLayoutStore";
import UploadModeSelectScene from "../../features/upload/scenes/UploadModeSelectScene";

export const Route = createFileRoute("/_stackedLayout/upload")({
  component: Upload,
});

function Upload() {
  useStackedLayoutInitiator({ title: "업로드" });

  return <UploadModeSelectScene />;
}
