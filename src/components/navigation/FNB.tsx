import { Link } from "@tanstack/react-router";
import styles from "./navigation.module.scss";
import { IcoTimeline } from "../common/icon/IcoTimeline";
import { IcoSetting } from "../common/icon/IcoSetting";
import { IcoUpload } from "../common/icon/IcoUpload";

export const FNB = () => {
  return (
    <div className={styles.fnbContainer}>
      <div id="footer" className={styles.fnb}>
        <div className={styles.fnbLeft}>
          <Link className={styles.sideButton} to="/">
            <IcoTimeline className={""} />
          </Link>
        </div>
        <div className={styles.fnbCenter}>
          <Link className={styles.mainButton} to="/">
            <IcoUpload />
          </Link>
        </div>
        <div className={styles.fnbRight}>
          <Link className={styles.sideButton} to="/">
            <IcoSetting className={""} />
          </Link>
        </div>
      </div>
    </div>
  );
};
