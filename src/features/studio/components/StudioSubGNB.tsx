import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import styles from "./StudioSubGNB.module.scss";

type StudioSubGNBProps = {
  userId: string;
};

export const StudioSubGNB = ({ userId }: StudioSubGNBProps) => {
  return (
    <div className={styles.subGnb}>
      <Link
        to="/studio/$userId"
        params={{ userId }}
        activeOptions={{ exact: true }}
      >
        {({ isActive }) => (
          <div className={clsx(styles.tab, isActive && styles.isActive)}>
            홈
          </div>
        )}
      </Link>
      <Link to="/studio/$userId/stages" params={{ userId }}>
        {({ isActive }) => (
          <div className={clsx(styles.tab, isActive && styles.isActive)}>
            영상
          </div>
        )}
      </Link>
      <Link to="/studio/$userId/reactions" params={{ userId }}>
        {({ isActive }) => (
          <div className={clsx(styles.tab, isActive && styles.isActive)}>
            리액션
          </div>
        )}
      </Link>
      <Link to="/studio/$userId/board" params={{ userId }}>
        {({ isActive }) => (
          <div className={clsx(styles.tab, isActive && styles.isActive)}>
            게시판
          </div>
        )}
      </Link>
    </div>
  );
};
