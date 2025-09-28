import styles from "./navigation.module.scss";
import { IcoSearch } from "../common/icon/IcoSearch";
import { IcoNoti } from "../common/icon/IcoNoti";
import logo from "@/assets/custom/haeder-logo.png";
import { Profile } from "../common/profile/Profile";
import { Link } from "@tanstack/react-router";

export const GNB = () => {
  return (
    <div id="header" className={styles.gnb}>
      <div className={styles.gnbLeft}>
        <Link className={styles.logo} to="/">
          <img src={logo} />
        </Link>
      </div>

      <div className={styles.gnbRight}>
        <Link to="/search">
          <IcoSearch className={""} />
        </Link>
        <Link to="/alert">
          <IcoNoti className={""} />
        </Link>
        <Link to="/studio">
          <Profile />
        </Link>
      </div>
    </div>
  );
};
