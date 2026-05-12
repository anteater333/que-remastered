import clsx from "clsx";
import { BackButton } from "../../../components/Buttons/BackButton";
import styles from "./navigation.module.scss";
import { LogoText } from "../../../components/common/logo/LogoText";
import { useLandingLayoutStore } from "../stores/landingLayoutStore";

export const LandingGNB = () => {
  const { showLogo } = useLandingLayoutStore();
  return (
    <div id="header" className={clsx(styles.gnb, styles.landingGnb)}>
      <div className={styles.gnbLeft}>
        <BackButton />
      </div>
      <div className={styles.gnbCenter}>
        {showLogo && (
          <div className={styles.logo}>
            <LogoText isColored />
          </div>
        )}
      </div>
      <div className={styles.gnbRight}></div>
    </div>
  );
};
