// 코어 컴포넌트 - 비디오 플레이어

type VideoPlayerProps = {
  sourceUrl: string;
};

export const VideoPlayer = ({ sourceUrl }: VideoPlayerProps) => {
  return <video src={sourceUrl}></video>;
};
