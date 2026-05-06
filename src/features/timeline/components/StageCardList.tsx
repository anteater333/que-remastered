import StageCard from "@/components/Cards/StageCard";
import type StageType from "@/types/Stage";
import styles from "./StageCardList.module.scss";

type StageCardListProps = {
  data: StageType[];
};

const StageCardList = ({ data }: StageCardListProps) => {
  return (
    <div className={styles.StageCardListContainer}>
      {data.map((Stage, index) => {
        return <StageCard key={index} stage={Stage} />;
      })}
    </div>
  );
};

export default StageCardList;
