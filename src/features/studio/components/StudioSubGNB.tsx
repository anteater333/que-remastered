import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import styles from "./StudioSubGNB.module.scss";

type StudioSubGNBProps = {
  handle: string;
};

export const StudioSubGNB = ({ handle }: StudioSubGNBProps) => {
  return (
    <div className={styles.subGnb}>
      <Link
        to="/studio/$handle"
        params={{ handle }}
        activeOptions={{ exact: true }}
      >
        {({ isActive }) => (
          <div className={clsx(styles.tab, isActive && styles.isActive)}>
            홈
          </div>
        )}
      </Link>
      <Link to="/studio/$handle/stages" params={{ handle }}>
        {({ isActive }) => (
          <div className={clsx(styles.tab, isActive && styles.isActive)}>
            영상
          </div>
        )}
      </Link>
      <Link to="/studio/$handle/reactions" params={{ handle }}>
        {({ isActive }) => (
          <div className={clsx(styles.tab, isActive && styles.isActive)}>
            리액션
          </div>
        )}
      </Link>
      <Link to="/studio/$handle/board" params={{ handle }}>
        {({ isActive }) => (
          <div className={clsx(styles.tab, isActive && styles.isActive)}>
            게시판
          </div>
        )}
      </Link>
    </div>
  );
};
