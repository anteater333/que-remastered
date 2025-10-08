import { Link } from "@tanstack/react-router";
import styles from "./navigation.module.scss";
import { IcoTimeline } from "@/components/common/icon/IcoTimeline";
import { IcoSetting } from "@/components/common/icon/IcoSetting";
import { IcoUpload } from "@/components/common/icon/IcoUpload";
import { useState } from "react";

export const FNB = () => {
  const [isAdmin] = useState(true);

  return (
    <div className={styles.fnbContainer}>
      <div id="footer" className={styles.fnb}>
        <div className={styles.fnbLeft}>
          <Link className={styles.sideButton} to="/">
            {({ isActive }) => <IcoTimeline isActive={isActive} />}
          </Link>
        </div>
        {isAdmin && (
          <div className={styles.fnbCenter}>
            <Link className={styles.mainButton} to="/upload">
              {({}) => <IcoUpload />}
            </Link>
          </div>
        )}
        <div className={styles.fnbRight}>
          <Link className={styles.sideButton} to="/setting">
            {({ isActive }) => <IcoSetting isActive={isActive} />}
          </Link>
        </div>
      </div>
    </div>
  );
};
