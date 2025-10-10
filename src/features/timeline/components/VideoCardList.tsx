import VideoCard from "@/components/Cards/VideoCard";
import type VideoType from "@/types/Video";

type VideoCardListProps = {
  data: VideoType[];
};

const VideoCardList = ({ data }: VideoCardListProps) => {
  return (
    <>
      {data.map((_, index) => {
        return <VideoCard key={index} />;
      })}
    </>
  );
};

export default VideoCardList;
