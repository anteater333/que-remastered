import { BackButton } from "../../../components/Buttons/BackButton";
import styles from "./navigation.module.scss";

export const LandingGNB = () => {
  return (
    <div id="header" className={styles.gnb}>
      <div className={styles.gnbLeft}>
        <BackButton />
      </div>
    </div>
  );
};
