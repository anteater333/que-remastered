import styles from "./navigation.module.scss";
import { IcoSearch } from "@/components/common/icon/IcoSearch";
import { IcoNoti } from "@/components/common/icon/IcoNoti";
import logo from "@/assets/custom/haeder-logo.png";
import { Profile } from "@/components/common/profile/Profile";
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
        <Link className={styles.button} to="/search">
          {({}) => <IcoSearch className={""} />}
        </Link>
        <Link className={styles.button} to="/alert">
          {({ isActive }) => <IcoNoti isActive={isActive} />}
        </Link>
        <Link className={styles.button} to="/studio">
          {({}) => <Profile />}
        </Link>
      </div>
    </div>
  );
};
