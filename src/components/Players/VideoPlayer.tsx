// 코어 컴포넌트 - 비디오 플레이어

import Hls from "hls.js";
import { useEffect, useRef } from "react";

type VideoPlayerProps = {
  sourceUrl: string;
};

export const VideoPlayer = ({ sourceUrl }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      return () => hls.destroy;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari
      video.src = sourceUrl;
    }

    return () => {};
  }, [sourceUrl]);

  return <video ref={videoRef} controls></video>;
};
