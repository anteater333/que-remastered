import { useEffect, useState } from "react";
import type { VideoUploadStatus } from "../../../types/Stage";
import { createVideoUploadStatusEventSource } from "../api";

export function useCheckVideoUpdateStatus(
  stageId: string,
  initialStatus: VideoUploadStatus,
) {
  const [status, setStatus] = useState<VideoUploadStatus>(initialStatus);

  useEffect(() => {
    if (!stageId || status === "DONE" || status === "FAILED") return;

    const es = createVideoUploadStatusEventSource(stageId);

    es.addEventListener("videoStatus", (e) => {
      const { status } = JSON.parse(e.data);
      console.log("🥕 :: ", status);

      es.close();
    });

    es.onerror = () => es.close();

    return () => es.close();
  }, [stageId]);

  return status;
}
