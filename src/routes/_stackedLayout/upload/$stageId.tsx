import { createFileRoute } from "@tanstack/react-router";
import UploadEditorScene from "../../../features/upload/scenes/UploadEditorScene";

export const Route = createFileRoute("/_stackedLayout/upload/$stageId")({
  component: Index,
});

function Index() {
  return <UploadEditorScene />;
}
