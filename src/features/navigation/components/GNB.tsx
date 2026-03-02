import styles from "./navigation.module.scss";
import { IcoSearch } from "@/components/common/icon/IcoSearch";
import { IcoNoti } from "@/components/common/icon/IcoNoti";
import { Profile } from "@/components/Profile/Profile";
import { Link } from "@tanstack/react-router";
import { IcoPerson } from "../../../components/common/icon/IcoPerson";
import { LogoText } from "../../../components/common/logo/LogoText";
import { useAuth } from "../../../hooks/useAuth";

export const GNB = () => {
  const { isLoggedIn, userProfile } = useAuth();

  return (
    <div id="header" className={styles.gnb}>
      <div className={styles.gnbLeft}>
        <Link className={styles.logo} to="/">
          <LogoText isColored={false} />
        </Link>
      </div>

      <div className={styles.gnbRight}>
        <Link className={styles.button} to="/search">
          {({}) => <IcoSearch className={""} />}
        </Link>
        {isLoggedIn ? (
          <>
            <Link className={styles.button} to="/alert">
              {({ isActive }) => <IcoNoti isActive={isActive} />}
            </Link>
            <Link
              className={styles.button}
              to="/studio/$handle"
              params={{ handle: userProfile.handle }}
            >
              {({}) => <Profile />}
            </Link>
          </>
        ) : (
          <Link className={styles.button} to="/intro">
            {({}) => <IcoPerson />}
          </Link>
        )}
      </div>
    </div>
  );
};
