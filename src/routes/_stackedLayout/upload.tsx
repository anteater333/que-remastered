import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStackedLayoutInitiator } from "../../features/navigation/stores/stackedLayoutStore";

export const Route = createFileRoute("/_stackedLayout/upload")({
  component: Upload,
});

function Upload() {
  useStackedLayoutInitiator({ title: "업로드" });

  return <div>Hello "/stackedLayout/"!</div>;
}
