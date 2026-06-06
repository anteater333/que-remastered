// 코어 컴포넌트 - 비디오 플레이어

import Hls from "hls.js";
import { useEffect, useRef, type ComponentProps } from "react";
import styles from "./VideoPlayer.module.scss";
import clsx from "clsx";

interface VideoPlayerProps extends ComponentProps<"div"> {
  sourceUrl: string;
}

export const VideoPlayer = ({
  className,
  sourceUrl,
  ...props
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari
      video.src = sourceUrl;
    }

    return () => {};
  }, [sourceUrl]);

  return (
    <div className={clsx(styles.videoPlayerContainer, className)} {...props}>
      <video ref={videoRef} controls />
      <div className={styles.overlay}></div>
      <div className={styles.controls}></div>
    </div>
  );
};
