import { useEffect, useState } from "react";
import StageCardList from "./components/StageCardList";
import type StageType from "@/types/Stage";
import { getTimelineStageList } from "./api";

const Timeline = () => {
  const [dataList, setDataList] = useState<StageType[]>([]);
  useEffect(() => {
    setDataList(getTimelineStageList());
  }, []);

  return <StageCardList data={dataList} />;
};

export default Timeline;
