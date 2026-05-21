import { useEffect, useState } from "react";
import type { VideoUploadStatus } from "../../../types/Stage";
import { createVideoUploadStatusEventSource } from "../api";

const safeSSEParse = (rawMessage: string) => {
  try {
    let parsed = JSON.parse(rawMessage);
    // 만약 한 번 풀었는데도 결과가 여전히 문자열이라면 한 번 더 파싱
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
    return parsed;
  } catch (error) {
    console.error("JSON 파싱 실패:", error);
    return null;
  }
};

export function useCheckVideoUpdateStatus(
  stageId: string,
  initialStatus: VideoUploadStatus,
) {
  const [status, setStatus] = useState<VideoUploadStatus>(initialStatus);

  useEffect(() => {
    if (!stageId || status === "DONE" || status === "FAILED") return;

    const es = createVideoUploadStatusEventSource(stageId);

    es.addEventListener("videoStatus", (e) => {
      const { status: newStatus } = safeSSEParse(e.data);
      setStatus(newStatus);
    });

    es.onerror = () => es.close();

    return () => es.close();
  }, [stageId]);

  return status;
}
