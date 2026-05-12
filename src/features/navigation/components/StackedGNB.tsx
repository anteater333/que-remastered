import clsx from "clsx";
import { BackButton } from "../../../components/Buttons/BackButton";
import styles from "./navigation.module.scss";
import { Button } from "../../../components/Buttons/Button";
import { useStackedLayoutStore } from "../stores/stackedLayoutStore";

export const StackedGNB = () => {
  const { buttonText, buttonType, buttonDisabled, title, onButtonClick } =
    useStackedLayoutStore();

  return (
    <div id="header" className={clsx(styles.gnb, styles.stackedGnb)}>
      <div className={styles.gnbLeft}>
        <BackButton />
      </div>
      <div className={styles.gnbCenter}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.gnbRight}>
        <Button
          className={styles.confirmButton}
          buttonType={buttonType ?? "default"}
          onClick={onButtonClick}
          disabled={buttonDisabled}
        >
          {buttonText ?? "확인"}
        </Button>
      </div>
    </div>
  );
};
