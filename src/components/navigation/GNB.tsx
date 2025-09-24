import styles from "./navigation.module.scss";
import { IcoSearch } from "../common/icon/IcoSearch";
import { IcoNoti } from "../common/icon/IcoNoti";
import logo from "@/assets/custom/haeder-logo.png";
import { Profile } from "../common/profile/Profile";

export const GNB = () => {
  return (
    <div id="header" className={styles.gnb}>
      <div className={styles.gnbLeft}>
        <img src={logo} />
      </div>

      <div className={styles.gnbRight}>
        <IcoSearch className={""} />
        <IcoNoti className={""} />
        <Profile />
      </div>
    </div>
  );
};
