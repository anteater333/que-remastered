import VideoCard from "@/components/Cards/VideoCard";
import type VideoType from "@/types/Video";
import styles from "./videoCardList.module.scss";

type VideoCardListProps = {
  data: VideoType[];
};

const VideoCardList = ({ data }: VideoCardListProps) => {
  return (
    <div className={styles.videoCardListContainer}>
      {data.map((video, index) => {
        return <VideoCard key={index} video={video} />;
      })}
    </div>
  );
};

export default VideoCardList;
