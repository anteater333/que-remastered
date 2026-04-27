import clsx from "clsx";
import { BackButton } from "../../../components/Buttons/BackButton";
import styles from "./navigation.module.scss";
import { Button } from "../../../components/Buttons/Button";

interface StackedGNBProps {
  confirmButtonText?: string;
  title: string;
}

export const StackedGNB = ({ confirmButtonText, title }: StackedGNBProps) => {
  return (
    <div id="header" className={clsx(styles.gnb, styles.stackedGnb)}>
      <div className={styles.gnbLeft}>
        <BackButton />
      </div>
      <div className={styles.gnbCenter}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.gnbRight}>
        <Button className={styles.confirmButton} disabled>
          {confirmButtonText ?? "확인"}
        </Button>
      </div>
    </div>
  );
};
