import styles from "./navigation.module.scss";
import { IcoSearch } from "@/components/common/icon/IcoSearch";
import { IcoNoti } from "@/components/common/icon/IcoNoti";
import { Profile } from "@/components/Profile/Profile";
import { Link, useNavigate } from "@tanstack/react-router";
import { IcoPerson } from "../../../components/common/icon/IcoPerson";
import { LogoText } from "../../../components/common/logo/LogoText";
import { useAuth } from "../../../hooks/useAuth";

export const GNB = () => {
  const { isLoggedIn, userProfile } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn && !userProfile.nickname) {
    // 로그인했지만 닉네임이 없는 사용자의 경우 (온보딩을 거치지 않음) 온보딩 페이지로 이동
    navigate({ to: "/onboarding" });
  }

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
              {({}) => (
                <Profile
                  profilePictureUrl={userProfile.profilePictureUrl}
                  userHandle={userProfile.handle}
                />
              )}
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
