import clsx from "clsx";
import { BackButton } from "../../../components/Buttons/BackButton";
import styles from "./navigation.module.scss";

export const LandingGNB = () => {
  return (
    <div id="header" className={clsx(styles.gnb, styles.landingGnb)}>
      <div className={styles.gnbLeft}>
        <BackButton />
      </div>
    </div>
  );
};
