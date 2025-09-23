import styles from "./navigation.module.scss";
import { IcoSearch } from "../common/icon/IcoSearch";
import { IcoNoti } from "../common/icon/IcoNoti";
import logo from "@/assets/custom/haeder-logo.png";

export const GNB = () => {
  return (
    <div id="header" className={styles.gnb}>
      <div>
        <img src={logo} />
      </div>

      <div>
        <IcoSearch className={""} />
        <IcoNoti className={""} />
      </div>
    </div>
  );
};
