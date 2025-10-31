import { useEffect, useState } from "react";
import VideoCardList from "./components/VideoCardList";
import type VideoType from "@/types/Video";
import { getTimelineVideoList } from "./api";

const Timeline = () => {
  const [dataList, setDataList] = useState<VideoType[]>([]);
  useEffect(() => {
    setDataList(getTimelineVideoList());
  }, []);

  return <VideoCardList data={dataList} />;
};

export default Timeline;
